import { initTokenServices } from "../services/token";
import { getToken, saveToken } from "../storage/token";
import { createWsConnect } from "./ws/ws";
import { Opcode, ReadyData, wsResData } from "../types/ws";
import { getBot, saveBotInfo } from "../storage/bot";
import { toObject } from "../utils/toObject";
import { saveStorageWsInfo } from "../storage/ws";
import { GROUP_AT_MESSAGE_CREATE } from "../const";
import { MessageType, replyGroupAt } from "../services/replyGroupAt";
import { FileType, uploadMedia } from "../services/media";
import { WS } from "../services/ws";
type Author = {
  id: string;
  member_openid: string;
  union_openid: string;
};

type Message = {
  author: Author;
  content: string;
  group_id: string;
  group_openid: string;
  id: string;
  timestamp: string;
};
type HandleAtEvent = {
  replyPlain: (message: string) => void;
  replyImage: (message: string, url: string) => void;
};
export type BotConfig = {
  appId: string;
  clientSecret: string;
  callback?: {
    handleGroupAt: (context: Message, event: HandleAtEvent) => void;
    handleWatchMessage?: (data?: wsResData) => void;
  };
};

export async function createBot(config: BotConfig) {
  let ws: WS | undefined;
  const startConnect = async () => {
    console.log("正在启动bot...");
    //激活token服务
    const { access_token } = await initTokenServices(
      config.appId,
      config.clientSecret,
      {
        getToken: saveToken,
      }
    );
    console.log("已获取到token", access_token);
    const ws = await createWsConnect(access_token, config.clientSecret);
    return ws;
  };
  const initWsEvent = (wsInstance: WS) => {
    wsInstance.on("message", (stream) => {
      const raw = toObject<wsResData>(stream);
      config?.callback?.handleWatchMessage?.(raw);
      saveStorageWsInfo({ session_id: raw?.s });
      switch (raw?.t) {
        case GROUP_AT_MESSAGE_CREATE: {
          const data: Message = raw.d;
          config?.callback?.handleGroupAt(data, {
            replyPlain: async (content: string) => {
              return await replyGroupAt({
                content,
                groupOpenId: data.group_openid,
                msg_type: MessageType.TEXT,
                msg_id: data.id,
              });
            },
            replyImage: async (content, url) => {
              const res = await uploadMedia({
                openId: data.group_openid,
                fileType: FileType.Image,
                fileData: url,
                targetType: "group",
              });
              return await replyGroupAt({
                content,
                groupOpenId: data.group_openid,
                media: {
                  file_info: res.file_info,
                },
                msg_type: MessageType.MEDIA,
                msg_id: data.id,
              });
            },
          });
        }
      }
      switch (raw?.op) {
        //Hello事件，表示登陆成功
        case Opcode.HELLO: {
          //注册心跳事件
          saveBotInfo({
            heartbeat_interval: raw.d.heartbeat_interval,
          });
          wsInstance.initHeartbeatService(raw.d.heartbeat_interval);
          //开始鉴权
          const { access_token } = getToken();
          wsInstance.authSession(access_token);
          break;
        }
        //Ready事件,表示鉴权成功,可获得bot基础信息
        case Opcode.DISPATCH: {
          const data: ReadyData = raw.d;
          saveBotInfo(data.user);
          break;
        }
      }
    });
    wsInstance.on("close", async (code) => {
      console.log("连接已关闭,code:", code);
      wsInstance.closed = true;
      console.log("正在重新连接...");
      ws = await startConnect();
      if (!ws) {
        console.error("未获取到ws实例");
        return undefined;
      }
      initWsEvent(ws);
    });
  };

  ws = await startConnect();
  if (!ws) {
    console.error("未获取到ws实例");
    return undefined;
  }
  initWsEvent(ws);

  return {
    ws,
    //回复群聊中的艾特消息
    replayGroupAt: (message: string) => {},
  };
}

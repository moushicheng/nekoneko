import { initTokenServices } from "../services/token";
import { getToken, saveToken } from "../storage/token";
import { createWsConnect } from "./ws/ws";
import { Opcode, ReadyData, wsResData } from "../types/ws";
import { getBot, saveBotInfo } from "../storage/bot";
import { toObject } from "../utils/toObject";
import { saveStorageWsInfo } from "../storage/ws";
import { GROUP_AT_MESSAGE_CREATE } from "../const";
import { MessageType, replyGroupAt } from "../services/replyGroupAt";
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
};
export type BotConfig = {
  appId: string;
  clientSecret: string;
  callback?: {
    handleGroupAt: (context: Message, event: HandleAtEvent) => void;
    handleWatchMessage?: (data: wsResData) => void;
  };
};

export async function createBot(config: BotConfig) {
  console.log("正在启动bot...");
  //激活token服务
  await initTokenServices(config.appId, config.clientSecret, {
    getToken: saveToken,
  });
  const access_token = getToken()?.access_token;
  console.log("已获取到token", access_token);
  const ws = await createWsConnect(access_token, config.clientSecret);

  ws.on("message", (stream) => {
    const raw = toObject<wsResData>(stream);
    config?.callback?.handleWatchMessage(raw);
    saveStorageWsInfo({ session_id: raw.s });
    switch (raw.t) {
      case GROUP_AT_MESSAGE_CREATE: {
        const data: Message = raw.d;
        config.callback.handleGroupAt(data, {
          replyPlain: (content: string) => {
            replyGroupAt({
              content,
              groupOpenId: data.group_openid,
              msg_type: MessageType.TEXT,
            });
          },
        });
      }
    }
    switch (raw.op) {
      //Hello事件，表示登陆成功
      case Opcode.HELLO: {
        //注册心跳事件
        saveBotInfo({
          heartbeat_interval: raw.d.heartbeat_interval,
        });
        ws.initHeartbeatService(raw.d.heartbeat_interval);
        //开始鉴权
        ws.authSession(access_token);
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
  return {
    ws,
    //回复群聊中的艾特消息
    replayGroupAt: (message: string) => {},
  };
}

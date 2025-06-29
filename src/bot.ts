import { initTokenServices } from "../services/token";
import { getToken, saveToken } from "../storage/token";
import { createWsConnect } from "./ws/ws";
import { Opcode, ReadyData, wsResData } from "../types/ws";
import { getBot, saveBotInfo } from "../storage/bot";
import { toObject } from "../utils/toObject";
import { saveStorageWsInfo } from "../storage/ws";
import { C2C_MESSAGE_CREATE, GROUP_AT_MESSAGE_CREATE } from "../const";
import {
  MarkdownObject,
  MessageType,
  replyAt,
  send,
} from "../services/replyGroupAt";
import { FileType, uploadMedia } from "../services/media";
import { WS } from "../services/ws";
import { Intends } from "../types/event";
import { httpClient, sandBoxBaseUrl } from "../services/request";
type Author = {
  id: string;
  member_openid: string;
  union_openid: string;
};

export type Message = {
  attachments?: Array<{
    content: string;
    content_type: string;
    filename: string;
    height: number;
    size: number;
    url: string;
    width: number;
  }>;
  author: Author;
  content: string;
  group_id: string;
  group_openid: string;
  id: string;
  timestamp: string;
};
type HandleAtEvent = {
  replyPlain: (message: string) => void;
  replyImage: (message: string, url: string | Buffer) => void;
  replayMarkdown: (message: MarkdownObject) => void;
  replayAudio: (message: string, url: string | Buffer) => void;
};
export type BotConfig = {
  appId: string;
  clientSecret: string;
  callback?: {
    handleAt: (context: Message, event: HandleAtEvent) => void;
    handleWatchMessage?: (data?: wsResData) => void;
  };
  sandBox?: boolean;
  intends?: Intends;
};

export async function createBot(config: BotConfig) {
  if (config.sandBox) {
    httpClient.defaults.baseURL = sandBoxBaseUrl
  }
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
    const ws = await createWsConnect(access_token, config);
    return ws;
  };
  const initWsEvent = (wsInstance: WS) => {
    wsInstance.on("message", (stream) => {
      const raw = toObject<wsResData>(stream);
      config?.callback?.handleWatchMessage?.(raw);
      saveStorageWsInfo({ session_id: raw?.s });
      if (
        raw &&
        [GROUP_AT_MESSAGE_CREATE, C2C_MESSAGE_CREATE].includes(raw.t || "")
      ) {
        const type = raw.t === GROUP_AT_MESSAGE_CREATE ? "group" : "user";
        const data: Message = raw.d;
        config?.callback?.handleAt(data, {
          replyPlain: async (content: string) => {
            return await replyAt(
              {
                content,
                groupOpenId: data?.group_openid,
                openId: data?.author.id,
                msg_type: MessageType.TEXT,
                msg_id: data.id,
              },
              type
            );
          },
          replyImage: async (content: string, fileData: string | Buffer) => {
            const res = await uploadMedia({
              groupOpenId: data.group_openid,
              openId: data?.author.id,
              fileType: FileType.Image,
              fileData: fileData,
              targetType: type,
            });
            return await replyAt(
              {
                content,
                openId: data?.author.id,
                groupOpenId: data.group_openid,
                media: {
                  file_info: res.file_info,
                },
                msg_type: MessageType.MEDIA,
                msg_id: data.id,
              },
              type
            );
          },
          replayAudio: async (content: string, fileData: string | Buffer) => {
            const res = await uploadMedia({
              groupOpenId: data.group_openid,
              openId: data?.author.id,
              fileType: FileType.Audio,
              fileData: fileData,
              targetType: type,
            })
            return await replyAt({
              content,
              openId: data?.author.id,
              groupOpenId: data.group_openid,
              media: {
                file_info: res.file_info,
              },
              msg_type: MessageType.MEDIA,
              msg_id: data.id,
            },
              type
            );
          },
          replayMarkdown: async (markdown: MarkdownObject, content?: string) => {
            return await replyAt(
              {
                markdown,
                content,
                groupOpenId: data.group_openid,
                openId: data?.author.id,
                msg_type: MessageType.MARKDOWN,
                msg_id: data.id,
              },
              type
            )
          },
        });
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
    sendUserPlain: async (openId: string, content: string) => {
      return await send(
        {
          content,
          openId,
          msg_type: MessageType.TEXT,
        },
        "user"
      );
    },
    sendUserImage: async (
      openId: string,
      content: string,
      fileData: string | Buffer
    ) => {
      const res = await uploadMedia({
        openId,
        fileType: FileType.Image,
        fileData: fileData,
        targetType: "user",
      });
      return await replyAt(
        {
          content,
          openId,
          media: {
            file_info: res.file_info,
          },
          msg_type: MessageType.MEDIA,
        },
        "user"
      );
    },
    sendUserMarkDown: async (
      openId: string,
      markdown: MarkdownObject,
      content?: string
    ) => {
      return await send(
        {
          markdown,
          content,
          openId,
          msg_type: MessageType.MARKDOWN,
        },
        "user"
      );
    },
    sendGroupPlain: async (groupOpenId: string, content: string) => {
      return await send(
        {
          content,
          groupOpenId: groupOpenId,
          msg_type: MessageType.TEXT,
        },
        "group"
      );
    },

    sendGroupImage: async (
      groupOpenId: string,
      content: string,
      fileData: string | Buffer
    ) => {
      const res = await uploadMedia({
        groupOpenId,
        fileType: FileType.Image,
        fileData: fileData,
        targetType: "group",
      });
      return await send(
        {
          content,
          groupOpenId,
          media: {
            file_info: res.file_info,
          },
          msg_type: MessageType.MEDIA,
        },
        "group"
      );
    },
    sendGroupMarkdown: async (
      groupOpenId: string,
      markdown: MarkdownObject,
      content: string
    ) => {
      return await send(
        {
          markdown,
          content,
          groupOpenId: groupOpenId,
          msg_type: MessageType.MARKDOWN,
        },
        "group"
      );
    },
  };
}

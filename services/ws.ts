import { WebSocket } from "ws";
import { httpClient } from "./request";
import { Opcode, WsEntry, wsReqData, wsResData } from "../types/ws";
import { Intends } from "../types/event";
import { getStorageWsEntry, getStorageWsInfo } from "../storage/ws";

type WS = WebSocket & {
  sendWs: (data: wsReqData) => void;
  authSession: (accessToken: string) => void;
  initHeartbeatService: (heartbeatInterval: number) => void;
};

export const connectWs = async (token: string, appId: string) => {
  const url = getStorageWsEntry()?.url;
  if (!url) {
    console.error("未获取到入口点url");
    return;
  }
  const ws = new WebSocket(url, {
    headers: {
      Authorization: `QQBot ${token}`,
      "X-Union-Appid": appId,
    },
  });
  const sendWs = (data: wsReqData) => {
    return new Promise((resolve, reject) => {
      try {
        const res = ws.send(
          typeof data === "string" ? data : JSON.stringify(data),
          (error) => {
            if (error) {
              reject(error);
            }
          }
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
      resolve(undefined);
    });
  };
  const authSession = (accessToken: string) => {
    console.log("开始鉴权....");
    sendWs({
      op: Opcode.IDENTIFY,
      d: {
        token: `QQBot ${accessToken}`,
        intents: Intends.GROUP_AT_MESSAGE_CREATE | Intends.DIRECT_MESSAGE,
        shard: [0, 1], // 分片信息,给一个默认值
      },
    });
  };
  const sendHeartbeatEvent = () => {
    sendWs({
      op: Opcode.HEARTBEAT,
      d: getStorageWsInfo().session_id,
    });
  };
  const initHeartbeatService = (heartbeatInterval: number) => {
    setInterval(() => {
      sendHeartbeatEvent();
    }, heartbeatInterval);
  };
  Object.assign(ws, {
    sendWs,
    authSession,
    initHeartbeatService,
  });
  return ws as WS;
};

export const getWsEntry: () => Promise<WsEntry> = async () => {
  return await httpClient.get("/gateway/bot").then((res) => {
    if (!res.data) throw new Error("获取ws连接信息异常");
    console.log("已获取到Ws入口点: " + res?.data?.url);
    return res.data;
  });
};

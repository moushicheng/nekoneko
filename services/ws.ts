import { WebSocket } from "ws";
import { getStorageWsEntry } from "../storage/ws";
import { httpClient } from "./request";

export const connectWs = async (token: string, appId: string) => {
  const url = getStorageWsEntry()?.url;
  const ws = new WebSocket(url, {
    headers: {
      Authorization: `QQBot ${token}`,
      "X-Union-Appid": appId,
    },
  });
  return ws;
};
type SessionStartLimit = {
  total: number; // 每 24 小时可创建 Session 数
  remaining: number; // 目前还可以创建的 Session 数
  reset_after: number; // 重置计数的剩余时间（毫秒）
  max_concurrency: number; // 每 5 秒可以创建的 Session 数
};

export type WsEntry = {
  url: string; // WebSocket 的连接地址
  shards?: number; // 建议的 shard 数
  session_start_limit?: SessionStartLimit; // Session 创建限制信息
};
export interface wsResData {
  op: number; // opcode
  d?: {
    heartbeat_interval?: number;
    session_id?: string;
    user?: {
      id?: string;
      username?: string;
      bot?: boolean;
      status?: number;
    };
  };
  // 心跳的唯一标识
  s: number;
  // 事件类型
  t: string;
  // 事件ID
  id?: string;
}
export const toObject = <T = any>(data: any) => {
  if (Buffer.isBuffer(data)) return JSON.parse(data.toString()) as T;
  if (typeof data === "object") return data as T;
  if (typeof data === "string") return JSON.parse(data) as T;
  // return String(data);
};
export const getWsEntry: () => Promise<WsEntry> = async () => {
  return await httpClient.get("/gateway/bot").then((res) => {
    if (!res.data) throw new Error("获取ws连接信息异常");
    console.log("已获取到Ws入口点: " + res?.data?.url);
    return res.data;
  });
};

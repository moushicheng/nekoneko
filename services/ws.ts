import { httpClient } from "./request";

const connect = async (token, appId) => {
  //   new WebSocket("aaa", {
  //     headers: {
  //       Authorization: "QQBot " + token,
  //       "X-Union-Appid": appId,
  //     },
  //   });
};
type SessionStartLimit = {
  total: number; // 每 24 小时可创建 Session 数
  remaining: number; // 目前还可以创建的 Session 数
  reset_after: number; // 重置计数的剩余时间（毫秒）
  max_concurrency: number; // 每 5 秒可以创建的 Session 数
};

export type WsEntry = {
  url: string; // WebSocket 的连接地址
  shards: number; // 建议的 shard 数
  session_start_limit: SessionStartLimit; // Session 创建限制信息
};
export const getWsEntry: () => Promise<WsEntry> = async () => {
  return await httpClient.get("/gateway/bot").then((res) => {
    if (!res.data) throw new Error("获取ws连接信息异常");
    return res.data;
  });
};

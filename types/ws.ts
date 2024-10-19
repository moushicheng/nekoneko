export enum Opcode {
  DISPATCH = 0, // 服务端进行消息推送
  HEARTBEAT = 1, // 客户端或服务端发送心跳
  IDENTIFY = 2, // 客户端发送鉴权
  RESUME = 6, // 客户端恢复连接
  RECONNECT = 7, // 服务端通知客户端重新连接
  INVALID_SESSION = 9, // identify 或 resume 的时候，如果参数有错
  HELLO = 10, // 网关下发的第一条消息
  HEARTBEAT_ACK = 11, // 发送心跳成功后收到的消息
  HTTP_CALLBACK_ACK = 12, // HTTP 回调模式的回包
}
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
export type wsResData = {
  op: number; // opcode
  d?: any;
  // 心跳的唯一标识
  s: number;
  // 事件类型
  t: string;
  // 事件ID
  id?: string;
};
export type wsReqData = Partial<wsResData>; //敌我同源

export const UnsupportedMethodError = new Error("暂未支持");
export const SessionEvents = {
  CLOSED: "CLOSED",
  READY: "READY", // 已经可以通信
  ERROR: "ERROR", // 会话错误
  INVALID_SESSION: "INVALID_SESSION",
  RECONNECT: "RECONNECT", // 服务端通知重新连接
  DISCONNECT: "DISCONNECT", // 断线
  EVENT_WS: "EVENT_WS", // 内部通信
  RESUMED: "RESUMED", // 重连
  DEAD: "DEAD", // 连接已死亡，请检查网络或重启
};
// websocket错误原因
export const WebsocketCloseReason = [
  {
    code: 4001,
    reason: "无效的opcode",
  },
  {
    code: 4002,
    reason: "无效的payload",
  },
  {
    code: 4007,
    reason: "seq错误",
  },
  {
    code: 4008,
    reason: "发送 payload 过快，请重新连接，并遵守连接后返回的频控信息",
    resume: true,
  },
  {
    code: 4009,
    reason: "连接过期，请重连",
    resume: true,
  },
  {
    code: 4010,
    reason: "无效的shard",
  },
  {
    code: 4011,
    reason: "连接需要处理的guild过多，请进行合理分片",
  },
  {
    code: 4012,
    reason: "无效的version",
  },
  {
    code: 4013,
    reason: "无效的intent",
  },
  {
    code: 4014,
    reason: "intent无权限",
  },
  {
    code: 4900,
    reason: "内部错误，请重连",
  },
  {
    code: 4914,
    reason: "机器人已下架,只允许连接沙箱环境,请断开连接,检验当前连接环境",
  },
  {
    code: 4915,
    reason: "机器人已封禁,不允许连接,请断开连接,申请解封后再连接",
  },
];

export type ReadyData = {
  version: number; // 版本
  session_id: string; // 会话 ID
  user: {
    id: string; // 用户 ID
    username: string; // 用户名
    bot: boolean; // 是否为机器人
    status: number; // 状态
  };
  shard: [number, number]; // 分片
};

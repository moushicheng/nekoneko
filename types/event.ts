export enum Intends {
  None = 0,
  GUILDS = 1 << 0, // 频道操作事件
  GUILD_MEMBERS = 1 << 1, // 频道成员变更事件
  GUILD_MESSAGES = 1 << 9, // 私域频道消息事件
  GUILD_MESSAGE_REACTIONS = 1 << 10, // 频道消息表态事件
  DIRECT_MESSAGE = 1 << 12, // 频道私信事件
  OPEN_FORUMS_EVENTS = 1 << 18,
  AUDIO_OR_LIVE_CHANNEL_MEMBERS = 1 << 19, // 音频或直播频道成员
  // GROUP_MESSAGE_CREATE = 1 << 24, // 群聊消息事件
  C2C_MESSAGE_CREATE = 1 << 25, // 私聊消息事件
  GROUP_AT_MESSAGE_CREATE = 1 << 25, // 群聊@消息事件
  INTERACTION = 1 << 26, // 互动事件
  MESSAGE_AUDIT = 1 << 27, // 消息审核事件
  FORUMS_EVENTS = 1 << 28, // 论坛事件(仅私域)
  AUDIO_ACTIONS = 1 << 29, // 音频操作事件
  PUBLIC_GUILD_MESSAGES = 1 << 30, // 公域机器人消息事件
}

export enum replyIntends {
  INTERACTION = 1 << 26, // 互动事件
  GROUP_ADD_ROBOT = 1 << 25, // 机器人被添加到群聊
  GROUP_MSG_RECEIVE = 1 << 25, //群管理员主动在机器人资料页操作开启通知
}

export type Intent =
  // 频道事件
  | "GUILDS"
  // 频道成员事件
  | "GUILD_MEMBERS"
  // 频道消息事件
  | "GUILD_MESSAGES"
  // 频道消息表态事件
  | "GUILD_MESSAGE_REACTIONS"
  // 频道私信事件
  | "DIRECT_MESSAGE"
  // 频道成员变更事件
  | "AUDIO_OR_LIVE_CHANNEL_MEMBERS"
  // 群聊消息事件
  | "GROUP_MESSAGE_CREATE"
  // 私聊消息事件
  | "C2C_MESSAGE_CREATE"
  // 群聊@消息事件
  | "GROUP_AT_MESSAGE_CREATE"
  // 互动事件
  | "INTERACTION"
  // 消息审核事件
  | "MESSAGE_AUDIT"
  // 论坛事件(仅私域)
  | "FORUMS_EVENTS"
  // 论坛事件(仅公域)
  | "OPEN_FORUMS_EVENTS"
  // 音频操作事件
  | "AUDIO_ACTIONS"
  // 公域机器人消息事件
  | "PUBLIC_GUILD_MESSAGES";

export enum ChannelType {
  Content = 0, // 文本频道
  Record = 2, // 语音频道
  ChannelGroup = 4, // 频道分组
  Live = 10005, // 直播频道
  App = 10006, // 应用频道
  Forms = 10007, // 论坛频道
}

export enum ChannelSubType {
  Chat = 0, // 闲聊
  Announces = 1, // 公告
  Strategy = 2, // 攻略
  Black = 3, // 开黑
}

export enum PrivateType {
  Public = 0, // 公开
  Admin = 1, // 频道主和管理员
  Some = 2, // 频道主、管理员以及指定成员
}

export enum SpeakPermission {
  All = 1, // 所有人
  Some = 2, // 频道主、管理员以及指定成员
}

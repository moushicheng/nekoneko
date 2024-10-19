type Bot = {
  id?: string;
  username?: string;
  bot?: boolean;
  status?: number;
  heartbeat_interval?: number;
};
export const bot: Bot | {} = {};

export const saveBotInfo = (info: Bot) => {
  Object.assign(bot, info);
};
export const getBot = () => {
  return bot;
};

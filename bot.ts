import { initTokenServices } from "./services/token";
import { getWsEntry } from "./services/ws";
import { getToken, saveToken, Token } from "./storage/token";
import { saveStorageWsEntry } from "./storage/ws";

export type BotConfig = {
  appId: string;
  clientSecret: string;
};

export async function createBot(config: BotConfig) {
  //激活token服务
  await initTokenServices(config.appId, config.clientSecret, {
    getToken: saveToken,
  });
  console.log("已获取到token", getToken()?.access_token);
  const data = await getWsEntry();
  if (!data) {
    console.log("wsEntry不存在!", data);
    return;
  }
  saveStorageWsEntry(data);
}

createBot({
  appId: "102444777",
  clientSecret: "2rhXND3tjaRI90riZRJB3vnfYRKD6zsm",
});

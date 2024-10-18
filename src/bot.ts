import { WebSocket } from "ws";
import { initTokenServices } from "../services/token";
import { connectWs, getWsEntry, toObject, wsResData } from "../services/ws";
import { getToken, saveToken, Token } from "../storage/token";
import { saveStorageWsEntry } from "../storage/ws";
import { createWsConnect } from "./ws/ws";

export type BotConfig = {
  appId: string;
  clientSecret: string;
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
    const data = toObject<wsResData>(stream);
    console.log(data);
  });
}

createBot({
  appId: "102444777",
  clientSecret: "2rhXND3tjaRI90riZRJB3vnfYRKD6zsm",
});

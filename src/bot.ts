import { initTokenServices } from "../services/token";
import { toObject } from "../services/ws";
import { getToken, saveToken } from "../storage/token";
import { createWsConnect } from "./ws/ws";
import { Opcode, ReadyData, wsResData } from "../types/ws";
import { getBot, saveBotInfo } from "../storage/bot";

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
    const raw = toObject<wsResData>(stream);
    console.log(raw);
    switch (raw.op) {
      //Hello事件，表示登陆成功
      case Opcode.HELLO: {
        saveBotInfo({
          heartbeat_interval: raw.d.heartbeat_interval,
        });
        //开始鉴权
        ws.authSession(access_token);
      }
      //Ready事件,表示鉴权成功,可获得bot基础信息
      case Opcode.DISPATCH: {
        const data: ReadyData = raw.d;
        saveBotInfo(data.user);
      }
    }
  });
}

createBot({
  appId: "102444777",
  clientSecret: "2rhXND3tjaRI90riZRJB3vnfYRKD6zsm",
});

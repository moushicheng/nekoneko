import { initTokenServices } from "./services/token";
import { saveToken, Token } from "./storage/token";

export type BotConfig = {
  appId: string;
  clientSecret: string;
};

export async function createBot(config: BotConfig) {
  //激活token服务
  initTokenServices(config.appId, config.clientSecret, {
    getToken: saveToken,
  });
}

createBot({
  appId: "102444777",
  clientSecret: "2rhXND3tjaRI90riZRJB3vnfYRKD6zsm",
});

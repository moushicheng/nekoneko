import axios from "axios";
import { Token } from "../storage/token";
const getToken = async (appid: string, secret: string) => {
  return new Promise<Token>((resolve, reject) => {
    axios
      .post("https://bots.qq.com/app/getAppAccessToken", {
        appId: appid,
        clientSecret: secret,
      })
      .then((res) => {
        if (res.status === 200 && res.data && typeof res.data === "object") {
          resolve(res.data as Token);
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const initTokenServices = async (
  appid: string,
  secret: string,
  callback: {
    getToken: (token: Token) => void;
  }
) => {
  const next = async (time: number) => {
    const token = await getToken(appid, secret);
    const duration = time === -1 ? (token.expires_in - 1) * 1000 : time;
    callback.getToken(token);
    //token快废了重新获取
    setTimeout(async () => {
      await next(token.expires_in);
    }, duration);
    return token;
  };

  return await next(-1);
};

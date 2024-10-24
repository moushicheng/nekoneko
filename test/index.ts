import axios from "axios";
import { createBot } from "../src/bot";
const url = "https:rove.gd.cn:8081/bQuery/123.png";
export type UserInfo = {
  name: string;
  uid: string;
  isHiddenAttention: boolean;
  face: string;
  userTag: [string, number][];
  processId: number;
  fans: number;
  level: number;
};
export type Response = {
  code: number;
  data: any;
  msg: string;
  success: boolean;
};
async function fetchData() {
  const uid = "123";
  const imageType = "png";
  const response = await axios.get(`https://rove.gd.cn:8081/bQuery/query`, {
    params: {
      uid,
      imageType,
    },
  });
  console.log(response.data);
  return response.data.data as UserInfo;
}

async function main() {
  const bot = await createBot({
    appId: "102444777",
    clientSecret: "2rhXND3tjaRI90riZRJB3vnfYRKD6zsm",
    callback: {
      handleGroupAt: async (context, event) => {
        console.log("context", context);
      },
      handleWatchMessage: (msg) => {
        console.log(msg);
      },
    },
  });
  setTimeout(() => {
    console.log("关闭");
    bot?.ws.close();
  }, 10000);
}
main();

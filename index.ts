import { createBot } from "./src/bot";
import { Intends } from "./types/event";
import { Message } from "./src/bot";
export { createBot, Intends };
export type { Message };

// async function main() {
//   const bot = await createBot({
//     appId: "102444777",
//     clientSecret: "2rhXND3tjaRI90riZRJB3vnfYRKD6zsm",
//     callback: {
//       handleAt: async (context, event) => {
//         console.log("context", context);
//         // event.replyImage('文字', '图片链接')
//         event.replyPlain('文字')
//       },
//       handleWatchMessage: (msg) => {
//         console.log(msg);
//       },
//     },
//   });
//   //发送单聊文本
//   // bot?.sendUserPlain(openId, "你好");
//   // //发送单聊图片
//   // bot?.sendUserImage(openId, "你好", path.join(__dirname, "./image.png"));
//   // //发送群聊文本
//   // bot?.sendGroupPlain(openId, "你好！");
//   // //发送群聊图片
//   // bot?.sendGroupImage(openId, "你好!", path.join(__dirname, "./image.png"));
// }
// main();
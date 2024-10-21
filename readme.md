# qq 群聊官方机器人框架

本机器人只做群聊，不做频道，因此有些许注意事项

## 基础文档

机器人框架文档：

https://bot.q.qq.com/wiki/develop/api-v2/
[消息发送](https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/send-receive/send.html)
[markdown 按钮](https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/trans/msg-btn.html)

腾讯开放平台：

https://q.qq.com/

接入流程：

https://bot.q.qq.com/wiki/#%E6%8E%A5%E5%85%A5%E6%B5%81%E7%A8%8B

## 关于注册

1. 为获得群聊能力，群聊机器人必须使用企业主体才能注册

2. 注册请看[接入流程](https://bot.q.qq.com/wiki/#%E6%8E%A5%E5%85%A5%E6%B5%81%E7%A8%8B)

3. 接入完毕后进入机器人后台,查看你的 appId 和 appSecret，用于框架消费

## 安装

```ts
npm install nekeneko
```

## 基础使用

```ts
async function main() {
  const bot = await createBot({
    appId: "xxx",
    clientSecret: "xxxx",
    callback: {
      handleGroupAt: async (context, event) => {
        //获取消息体
        console.log("context", context);
        //回复消息
        event.replyPlain("你好");
        //回复图文消息
        event.replyImage("你好", "https://xxxx.png");
      },
      handleWatchMessage: (msg) => {
        console.log(msg);
      },
    },
  });
}
```

## github

https://github.com/moushicheng/qqgroup-bot

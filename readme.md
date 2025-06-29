<p align="center">
  <img src="https://github.com/moushicheng/nekoneko/blob/main/github/logo.png?raw=true" alt="Nekoneko Logo" width="500" height="500" />
</p>

# nekoneko - 基于 tencent 官方的 qq 群聊机器人框架

nekoneko 框架只做群聊，不做频道，因此有些许注意事项

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
npm install nekoneko
```

## 基础使用

```ts
async function main() {
  const bot = await createBot({
    appId: "xxx", //请从机器人后台获得
    clientSecret: "xxxx", //请从机器人后台获得
    callback: {
      handleAt: async (context, event) => {
        console.log("context", context);
      },
      handleWatchMessage: (msg) => {
        console.log(msg);
      },
    },
  });
  //发送单聊文本
  bot?.sendUserPlain(openId, "你好");
  //发送单聊图片
  bot?.sendUserImage(openId, "你好", path.join(__dirname, "./image.png"));
  //发送群聊文本
  bot?.sendGroupPlain(openId, "你好！");
  //发送群聊图片
  bot?.sendGroupImage(openId, "你好!", path.join(__dirname, "./image.png"));
}
main();
```

## 注意事项

### 接口 & SDK

腾讯制定了一系列匪夷所思的规则，笔者挑选了几个具有代表性的罄竹难书:

1. URL 域名必须备案且经过认证（认证方式是在域名的某个路径放置一个文件）
2. 服务器必须有公网 IP（最近突然发公告说 Bot 必须绑定 IP，被骂的挺惨的，腾讯说会考虑取消这个限制 只是套话 应该不会改）
3. 不能获取用户信息（无法获取用户 QQ 号，昵称，头像等，取而代之的是一长串 openid，即使是同一用户在不同群也会有不同的 ID，腾讯半年前说会更新）
4. `qq 群聊机器人腾讯目前仅支持回复 AT 事件，且主动发送消息每月限制4条,被动（回复别人的艾特消息）无限条`

### 生成内容尺度

#### 关于文本

腾讯对文本审核尺度把握非常迷惑严格，列举几个一般人觉得没问题但腾讯不允许出现的词汇：

上瘾，生病，胸，腿(等身体部位)，美国(或任何国家)，迪士尼系列的所有名词，，警察，药

上面的词汇仅限中文，用英文可以过审

能否过审主要取决于审核的心情，每个审核的 G 点不一样

### 关于图片

几乎没有标准

## 封号

几个可能导致封号的行为：

复读用户发过的消息或发送用户的 ID。

复读用户的表情包/图片或处理后发送用户的头像。

在某些日子发送或回复某些词汇，强烈建议了解以避免踩雷。坦克，蛋炒饭等

被举报包含 AI 回复的功能，AI 必须有对应资质。

## github

https://github.com/moushicheng/qqgroup-bot

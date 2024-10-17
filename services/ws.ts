const connect = async (token, appId) => {
  //   new WebSocket("aaa", {
  //     headers: {
  //       Authorization: "QQBot " + token,
  //       "X-Union-Appid": appId,
  //     },
  //   });
};

const getWsEntryUrl = () => {
  return new Promise<void>((resolve) => {
    this.bot.request
      .get("/gateway/bot", {
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "utf-8",
          "Accept-Language": "zh-CN,zh;q=0.8",
          Connection: "keep-alive",
          "User-Agent": "v1",
          Authorization: "",
        },
      })
      .then((res) => {
        if (!res.data) throw new Error("获取ws连接信息异常");
        this.wsUrl = res.data.url;
        resolve();
      });
  });
};

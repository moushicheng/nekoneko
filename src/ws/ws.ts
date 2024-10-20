import { connectWs, getWsEntry } from "../../services/ws";
import { saveStorageWsEntry } from "../../storage/ws";

export const createWsConnect = async (access_token: string, secret: string) => {
  const data = await getWsEntry();
  if (!data) {
    console.log("wsEntry不存在!", data);
    return;
  }
  await saveStorageWsEntry(data);
  //连接到ws
  const ws = await connectWs(access_token, secret);

  return ws;
};

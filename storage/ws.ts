import { WsEntry } from "../types/ws";
type WsInfo = {
  entry?: WsEntry;
  session_id?: number;
};
export const wsInfo: WsInfo = {
  entry: {},
};
export const saveStorageWsEntry = (entry: WsEntry) => {
  Object.assign(wsInfo.entry as WsEntry, entry);
};
export const saveStorageWsInfo = (info: WsInfo) => {
  Object.assign(wsInfo, info);
};
export const getStorageWsEntry = () => {
  return wsInfo.entry;
};

export const getStorageWsInfo = () => {
  return wsInfo;
};

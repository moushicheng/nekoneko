import { WsEntry } from "../types/ws";

export const wsEntry: WsEntry = {
  url: "",
};
export const saveStorageWsEntry = (entry: WsEntry) => {
  Object.assign(wsEntry, entry);
};
export const getStorageWsEntry = () => {
  return wsEntry;
};
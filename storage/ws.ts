import { WsEntry } from "../services/ws";

export const wsEntry: WsEntry | undefined = undefined;
export const saveStorageWsEntry = (entry: WsEntry) => {
  Object.assign(wsEntry, entry);
};
export const getStorageWsEntry = () => {
  return wsEntry;
};

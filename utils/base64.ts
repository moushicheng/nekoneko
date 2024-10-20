import { BinaryLike, createHash } from "crypto";
import * as fs from "fs";
import axios from "axios";
/** md5 hash */
export const md5 = (data: BinaryLike) =>
  createHash("md5").update(data).digest().toString("hex");
export function isEmpty<T>(data: T) {
  if (!data) return true;
  if (typeof data !== "object") return false;
  return Reflect.ownKeys(data).length === 0;
}

export function remove<T>(list: T[], item: T) {
  const index = list.indexOf(item);
  if (index !== -1) list.splice(index, 1);
}
export async function getBase64FromLocal(filepath: string) {
  return (await fs.readFileSync(filepath.replace("file://", ""))).toString(
    "base64"
  );
}
export async function getBase64FromWeb(url: string) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return Buffer.from(res.data).toString("base64");
}
export function getFileBase64(file: string | Buffer) {
  if (Buffer.isBuffer(file)) return file.toString("base64");
  if (file.startsWith("http")) return getBase64FromWeb(file);
  if (file.startsWith("base64://")) return file.replace("base64://", "");
  try {
    return getBase64FromLocal(file);
  } catch {}
  return file;
}

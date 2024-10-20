import { getFileBase64 } from "../utils/base64";
import { httpClient } from "./request";

export enum FileType {
  Image = 1,
  Video = 2,
  Audio = 3,
}
export type TargetType = "user" | "group";
type UploadResult = {
  file_uuid: string; //	文件 ID
  file_info: string; //	文件信息，用于发消息接口的 media 字段使用
  ttl: number; //	有效期，表示剩余多少秒到期，到期后 file_info 失效，当等于 0 时，表示可长期使用
  id: string; //	发送消息的唯一ID，当srv_send_msg设置为true时返回
};
type Params = {
  openId: string;
  targetType: TargetType;
  fileData: string | Buffer;
  fileType: FileType;
};
export async function uploadMedia(params: Params) {
  const { openId, targetType, fileData, fileType } = params;
  const fileDataParsed = await getFileBase64(fileData);
  const { data: result } = await httpClient.post(
    `/v2/${targetType}s/${openId}/files`,
    {
      file_type: fileType,
      file_data: fileDataParsed,
      srv_send_msg: false,
    }
  );

  return result as UploadResult;
}

export const replyRichMsg = async (fileType: FileType) => {};

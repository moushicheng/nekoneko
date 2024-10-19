export const toObject = <T = any>(data: any) => {
  if (Buffer.isBuffer(data)) return JSON.parse(data.toString()) as T;
  if (typeof data === "object") return data as T;
  if (typeof data === "string") return JSON.parse(data) as T;
};

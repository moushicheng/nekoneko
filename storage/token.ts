export type Token = {
  access_token: string;
  expires_in: number;
  cache: string;
};
export const token: Token = {
  access_token: "",
  expires_in: -1,
  cache: "",
};
export const saveToken = (_token) => {
  token.access_token = _token.access_token;
  token.cache = _token.cache;
  token.expires_in = _token.expires_in;
};
export const getToken = () => {
  return token;
};

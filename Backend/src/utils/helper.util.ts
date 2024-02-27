import { createHash } from 'crypto';

export const sha256 = (x: string) => createHash('sha256').update(x, 'utf8').digest('hex');

type kong_resp = {
    key: string,
    secret: string
}

export function parseJwt (token: string):  {username: string, exp: number, isMedic: 'Y'| 'N'} {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const get_username = (token: string): string => parseJwt(token)?.username;


export function get_GW_Data(): Promise<kong_resp[]> {
    return fetch("http://kong-gateway:8001/consumers/backend-jwt/jwt")
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<{ data: kong_resp[] }>
    })
    .then(data => {
        return data.data
    })
}
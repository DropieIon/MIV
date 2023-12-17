import { createHash } from 'crypto';

export const sha256 = (x: string) => createHash('sha256').update(x, 'utf8').digest('hex');

type kong_resp = {
    key: string,
    secret: string
}

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
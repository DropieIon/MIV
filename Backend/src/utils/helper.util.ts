import { createHash } from 'crypto';
import { createReadStream } from 'fs';

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

export function createMD5(filePath: string): Promise<string> {
  return new Promise((res, rej) => {
    const hash = createHash('md5');
    const rStream = createReadStream(filePath);
    rStream.on('data', (data) => {
      hash.update(data);
    });
    rStream.on('end', () => {
      res(hash.digest('hex'));
    });
  })
}

// export function parseSize(size: string): number {
//   if(!/^[0-9]+(K|M|G)?/.test(size.toUpperCase()))
//     return -1;
//   if(size.includes('K'))
//     return parseInt(size.split('K')[0]) * 1024;
//   if(size.includes('M'))
//     // * 1024 * 1024
//     return parseInt(size.split('M')[0]) * 1048576;
//   if(size.includes('G'))
//     // * 1024 * 1024 * 1024
//     return parseInt(size.split('G')[0]) * 1073741824;
//   return -1;
// }
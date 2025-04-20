import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { token_data } from '../../../Common/types';
import { logger } from './logger';

export const sha256 = (x: string) => createHash('sha256').update(x, 'utf8').digest('hex');

type kong_resp = {
    key: string,
    secret: string
}

export function parseJwt (token: string):  token_data {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const get_username = (token: string): string => parseJwt(token)?.username;


export function get_GW_Data(): Promise<kong_resp[]> {
    return fetch("http://kong-gateway:8001/consumers/backend-jwt/jwt")
    .then(response => {
      if (!response.ok) {
        logger.error({
            message: response.statusText,
            labels: {
                "origin": "helper"
            }
        });
        throw new Error(response.statusText);
      }
      logger.info({
        message: "Got kong data successfully",
        labels: {
            "origin": "helper"
        }
      });
      return response.json() as Promise<{ data: kong_resp[] }>
    })
    .then(data => {
        if(!data.data) {
            logger.error({
                message: "No data",
                labels: {
                    "origin": "helper"
                }
            });
            throw new Error("No data");
        }
        logger.info({
            message: "Got kong data successfully",
            labels: {
                "origin": "helper"
            }
        });
        return data.data;
    });
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

function firstLetterToUpper(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatName(name: string): string {
  if(!name)
    return "";
  const name_split = name.split(' ');
  return firstLetterToUpper(name_split[0]) + 
      (name_split.length === 1 ? '' : ' ' + firstLetterToUpper(name_split[1]));
}

import type {token_data} from '../../Common/types'

export function parseJwt (token: string): token_data {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export function parseJwt (token: string): {exp: number, isMedic: 'Y'| 'N'} {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
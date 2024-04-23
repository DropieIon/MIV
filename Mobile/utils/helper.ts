type tokenData = {
    exp: number,
    isMedic: 'Y' | 'N',
    canUpload: boolean,
    unlimitedUploads4h: boolean
}

export function parseJwt (token: string): tokenData {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
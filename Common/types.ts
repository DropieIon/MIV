type handShake = {
    type: 'handshake';
    size: number;
    nrOfPackets: number;
    token: string;
    user: string;
}

type splitFile = {
    type: 'splitFile';
    data: string;
}

type EOS = {
    type: 'EOS';
    canceled: boolean;
    md5?: string;
}

type token_data = {
    username: string,
    role: string,
    canUpload: boolean,
    unlimitedUp4h: boolean
}

export {
    handShake,
    splitFile,
    EOS,
    token_data
}
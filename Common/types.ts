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

export {
    handShake,
    splitFile,
    EOS
}
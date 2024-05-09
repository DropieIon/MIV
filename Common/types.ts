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
    unlimitedUp4h: boolean,
    exp?: number,
}

type messageData = {
    message: string,
    read?: boolean,
    timestamp: number,
    senderUsername?: string
}

type getMessageListReq = {
    recvUser: string,
    study_id: string
}

type messageOverWS = {
    recv: string,
    study_id: string,
    message: string,
}

export {
    handShake,
    splitFile,
    EOS,
    token_data,
    messageData,
    messageOverWS,
    getMessageListReq
}
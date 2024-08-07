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
    timestamp: number,
    senderUsername?: string
}

type getMessageListReq = {
    recvUser: string,
    study_id: string
}

type messageOverWS = {
    study_id: string,
    message: string,
}

type accountDetails = {
    fullName: string,
    pfp: string,
    birthday: number,
    sex: 'M' | 'F',
}

type pfpsItem = {
    username: string,
    pfp: string
}

type MyDocsListEntry = {
    uuid: string,
    pfp: string,
    sex: 'M' | 'F',
    fullName: string,
    birthday: string,
}

export {
    handShake,
    splitFile,
    EOS,
    token_data,
    messageData,
    messageOverWS,
    pfpsItem,
    accountDetails,
    getMessageListReq,
    MyDocsListEntry
}
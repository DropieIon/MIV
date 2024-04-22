import { Socket } from "socket.io-client";
import { splitFile, EOS } from '../../../Common/types'

const mainEv = 'split-file';

async function sendBytes(socket: Socket, data: string) {
    const toSend: splitFile = {
        type: 'splitFile',
        data
    }
    socket.emit(mainEv, toSend);
}

async function sendEOS(socket: Socket, md5: string, canceled: boolean) {
    const toSend: EOS = {
        type: 'EOS',
        canceled,
        md5
    }
    socket.emit(mainEv, toSend);
}

export {
    sendBytes,
    sendEOS
}
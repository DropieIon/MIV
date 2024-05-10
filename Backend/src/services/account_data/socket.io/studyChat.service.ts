import { messageData, messageOverWS } from "../../../../../Common/types";
import { Socket } from "socket.io";
import { dbGetLastMessages, dbStoreMsg } from "../../db/account_data/db-study-chat.service";
import { parseJwt } from "../../../utils/helper.util";

export function sockReceiveMsg(socket: Socket, data: messageOverWS) {
    const token = socket.handshake.headers.authorization?.split('Bearer ')[1];
    if(token) {
        dbStoreMsg(parseJwt(token).username, data)
        .then((dbResp: string) => {
            if(dbResp !== "") {
                socket.emit('err', "Couldn't store message");
                console.error("Error storing message: " + dbResp);
            }
        });
        socket.emit('msg-to-client', data.message);
    }
    else {
        console.error('No token for message req');
        socket.emit('err', 'No token');
    }
}

export function sockGetMsgs(socket: Socket, recvUser: string, study_id: string, callback: any) {
    const token = socket.handshake.headers.authorization?.split('Bearer ')[1];
    if(token) {
        console.log(parseJwt(token).username, recvUser);
        
        dbGetLastMessages(parseJwt(token).username, recvUser, study_id)
        .then((dbResp: string | messageData[]) => {
            if(typeof dbResp === "string") {
                socket.emit('err', "Couldn't get messages");
                console.error("Error getting messages: " + dbResp);
                return;
            }
            else {
                callback(dbResp);
            }
        });
    }
    else {
        console.error('No token for message req');
        socket.emit('err', 'No token');
    }
}
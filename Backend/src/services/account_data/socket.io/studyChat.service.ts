import { messageData, messageOverWS } from "../../../../../Common/types";
import { Socket } from "socket.io";
import { dbGetLastMessages, dbStoreMsg } from "../../db/account_data/db-study-chat.service";

export function sockReceiveMsg(socket: Socket, username: string, data: messageOverWS) {
    dbStoreMsg(username, data)
        .then((dbResp: string) => {
            if (dbResp !== "") {
                socket.emit('err', "Couldn't store message");
                console.error("Error storing message: " + dbResp);
            }
        });
    socket.emit('msg-to-client', data.message);
}

export function sockGetMsgs(socket: Socket, study_id: string, callback: any) {
    const token = socket.handshake.headers.authorization?.split('Bearer ')[1];
    if (token) {
        dbGetLastMessages(study_id)
            .then((dbResp: string | messageData[]) => {
                if (typeof dbResp === "string") {
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
import { messageData, messageOverWS } from "../../../../../Common/types";
import { Socket } from "socket.io";
import { dbGetLastMessages, dbStoreMsg } from "../../db/account_data/db-study-chat.service";
import { logger } from "../../../utils/logger";

export function sockReceiveMsg(socket: Socket, username: string, data: messageOverWS) {
    dbStoreMsg(username, data)
        .then((dbResp: string) => {
            if (dbResp !== "") {
                logger.error({
                    message: `Error storing message: "${dbResp}"`,
                    labels: {
                        "origin": "svc"
                    }
                })
                socket.emit('err', "Couldn't store message");
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
                    logger.error({
                        message: `Error getting messages: "${dbResp}"`,
                        labels: {
                            "origin": "svc"
                        }
                    });
                    socket.emit('err', "Couldn't get messages");
                    return;
                }
                else {
                    callback(dbResp);
                }
            });
    }
    else {
        logger.error({
            message: 'No token for message req',
            labels: {
                "origin": "svc"
            }
        });
        socket.emit('err', 'No token');
    }
}
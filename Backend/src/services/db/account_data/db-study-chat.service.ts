import mariadb from 'mariadb';
import { sq } from '../db-functions';
import { messageData, messageOverWS } from '../../../../../Common/types';
import { logger } from '../../../utils/logger';

export async function dbStoreMsg(sender: string, msgData: messageOverWS) {
    const {
        message,
        study_id
    } = msgData;
    const query_resp = await sq('insert into messages (\
        username_sender, study_id, \
        message, stamp) \
        values (?, ?, ?, ?)',
        [sender, study_id, message, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                logger.error({
                    message: "There was an error sending the message",
                    labels: {
                        "origin": "db"
                    }
                });
                return "There was an error sending the message";
            }
            logger.error({
                message: `Database insertion error ${query_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return `Database insertion error ${query_resp.sqlMessage}`;
        }
    }
    logger.info({
        message: "Message inserted",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function dbGetLastMessages(study_id: string): Promise<string | messageData[]> {
    let sql_resp = await sq
        ('select message, stamp, username_sender from messages \
        where study_id = ? \
        ORDER BY stamp DESC \
        LIMIT 20',
        [study_id]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        if(sql_resp.length === 0) {
            logger.info({
                message: "Got no messages",
                labels: {
                    "origin": "db"
                }
            });
            return [];
        }
        let resp_list: messageData[] = [];
        for (let i = 0; i < sql_resp.length; i++) {
            const current_resp = sql_resp[i];
            resp_list.push({
                message: current_resp.message,
                timestamp: current_resp.stamp,
                senderUsername: current_resp.username_sender
            });
        }
        logger.info({
            message: "Got messages",
            labels: {
                "origin": "db"
            }
        });
        return resp_list;
    }
    logger.error({
        message: "Cannot get messages",
        labels: {
            "origin": "db"
        }
    });
    return "Cannot get messages";
}
import mariadb from 'mariadb';
import { sq } from '../db-functions';
import { messageData, messageOverWS } from '../../../../../Common/types';

export async function dbStoreMsg(sender: string, msgData: messageOverWS) {
    const {
        recv,
        message,
        study_id
    } = msgData;
    const query_resp = await sq('insert into messages (\
        username_sender, username_receiver, study_id, \
        message, stamp) \
        values (?, ?, ?, ?, NOW())',
        [sender, recv, study_id, message]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                return "There was an error sending the message";
            }
            return "Database insertion error " + query_resp.sqlMessage;
        }
    }
    return "";
}

export async function dbGetLastMessages(username: string, recv: string, study_id: string): Promise<string | messageData[]> {
    const sql_resp = await sq
        ('select message, read, stamp from profile_pictures \
        where username_sender in (?, ?) \
        and username_receiver in (?, ?) \
        and study_id = ? \
        ORDER BY stamp DESC \
        LIMIT 100',
        [username, recv, username, recv, study_id]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        if(sql_resp.length === 0)
            return [];
        let resp_list: messageData[] = [];
        for (let i = 0; i < sql_resp.length; i++) {
            const current_resp = sql_resp[i];
            resp_list.push({
                message: current_resp.message,
                read: current_resp.read,
                timestamp: current_resp.stamp,
            });
        }
    }
    return "Cannot get messages";
}
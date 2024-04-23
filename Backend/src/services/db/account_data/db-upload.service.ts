import { sq } from "../db-functions";
import mariadb from 'mariadb';

export async function dbCheckUpload(patUsername: string, size: number): Promise<string | boolean> {
    // 3Gb
    const maxSize = 3221225472;
    try {
        let queryResp = await sq(
            'select bytes, stamp from bytesUploadedToday \
            where patient_username = ?',
            [patUsername]);
            if (typeof queryResp !== "string" && !(queryResp instanceof mariadb.SqlError)) {
                // it's the resp list
                if(queryResp.length === 0) {
                    if(size > maxSize)
                        return false;
                    queryResp = await sq(
                        'insert into bytesUploadedToday(\
                        patient_username, bytes, stamp) \
                        values (?, ?, NOW())',
                        [patUsername, size]
                    );
                    if (typeof queryResp === "string" || (queryResp instanceof mariadb.SqlError)) {
                        return "Cannot insert bytes uploaded.";
                    }
                    return true;
                }
                // if it's today
                if ((Math.abs(new Date().getTime() - new Date(queryResp[0].stamp).getTime()) / 36e5) < 24) {
                    // if it would upload more than 3Gb
                    if(BigInt(maxSize) - queryResp[0].bytes < BigInt(size))
                        return false;
                    // this may look weird at first
                    // but stamp = stamp is used
                    // to specifically maintain the stamp
                    // otherwise updating the stamp updates
                    // the stamp as well
                    queryResp = await sq(
                        'update bytesUploadedToday \
                        set bytes = bytes + ?, stamp = stamp \
                        where patient_username = ?',
                        [size, patUsername]
                    );
                    if (typeof queryResp === "string" || (queryResp instanceof mariadb.SqlError)) {
                        return "Cannot update bytes uploaded.";
                    }
                    return true;
                }
                else {
                    // it has passed more than 24h
                    if(size > maxSize)
                        return false;
                    queryResp = await sq(
                        'update bytesUploadedToday \
                        set bytes = ?, stamp = NOW() \
                        where patient_username = ?',
                        [size, patUsername]
                    );
                    if (typeof queryResp === "string" || (queryResp instanceof mariadb.SqlError)) {
                        return "Cannot update bytes uploaded.";
                    }
                    return true;
                }
            }
            return "Cannot check upload permission.";   
    } catch (error) {
        console.error('Db err ' + error);
        return 'Db err';
    }
}

export async function dbCheckUnlimUploads4h(username: string)
    : Promise<string | boolean> {
    const queryResp = await sq(
        'select stamp from unlimitedUploads where patient_username = ?',
        [username]
    );
    if (queryResp !== "") {
        if (queryResp instanceof mariadb.SqlError) {
            return "Database unlimitedUploads check error";
        }
        if (typeof queryResp !== "string") {
            // is the resp list
            if (queryResp.length === 0)
                return false;
            if ((Math.abs(new Date().getTime() - new Date(queryResp[0].stamp).getTime()) / 36e5) > 4)
                return false;
            return true;
        }
    }
    return "";
}

export async function dbAllowUnlim4h(patUsername: string): Promise<string> {
    const queryResp = await sq(
        'insert into unlimitedUploads(\
            patient_username, stamp) values \
            (?, NOW()) \
            on duplicate key update stamp = NOW()',
        [patUsername]
    );
    if (typeof queryResp === "string" || (queryResp instanceof mariadb.SqlError)) {
        console.error(queryResp);
        return "Cannot allow patient.";
    }
    return "";
}

import { sq } from "../db-functions";
import mariadb from 'mariadb';
import { logger } from '../../../utils/logger';

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
                        logger.error({
                            message: "Cannot insert bytes uploaded.",
                            labels: {
                                "origin": "db"
                            }
                        });
                        return "Cannot insert bytes uploaded.";
                    }
                    logger.info({
                        message: "Bytes inserted",
                        labels: {
                            "origin": "db"
                        }
                    });
                    return true;
                }
                // if it's today
                if ((Math.abs(new Date().getTime() - new Date(queryResp[0].stamp).getTime()) / 36e5) < 24) {
                    // if it would upload more than 3Gb
                    if(BigInt(maxSize) - queryResp[0].bytes < BigInt(size)) {
                        logger.error({
                            message: "Cannot update bytes uploaded.",
                            labels: {
                                "origin": "db"
                            }
                        });
                        return false;
                    }
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
                        logger.error({
                            message: "Cannot update bytes uploaded.",
                            labels: {
                                "origin": "db"
                            }
                        });
                        return "Cannot update bytes uploaded.";
                    }
                    logger.info({
                        message: "Bytes updated",
                        labels: {
                            "origin": "db"
                        }
                    });
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
                        logger.error({
                            message: "Cannot update bytes uploaded.",
                            labels: {
                                "origin": "db"
                            }
                        });
                        return "Cannot update bytes uploaded.";
                    }
                    logger.info({
                        message: "Bytes updated",
                        labels: {
                            "origin": "db"
                        }
                    });
                    return true;
                }
            }
            logger.error({
                message: "Cannot check upload permission.",
                labels: {
                    "origin": "db"
                }
            });
            return "Cannot check upload permission.";   
    } catch (error) {
        logger.error({
            message: `Db err ${error}`,
            labels: {
                "origin": "db"
            }
        });
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
            if (queryResp.length === 0) {
                logger.info({
                    message: "No unlimitedUploads",
                    labels: {
                        "origin": "db"
                    }
                });
                return false;
            }
            if ((Math.abs(new Date().getTime() - new Date(queryResp[0].stamp).getTime()) / 36e5) > 4) {
                logger.info({
                    message: "UnlimitedUploads expired",
                    labels: {
                        "origin": "db"
                    }
                });
                return false;
            }
            logger.info({
                message: "UnlimitedUploads still valid",
                labels: {
                    "origin": "db"
                }
            });
            return true;
        }
    }
    logger.error({
        message: "Cannot check unlimitedUploads",
        labels: {
            "origin": "db"
        }
    });
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
        logger.error({
            message: `Cannot allow unlimmitedUploads: ${queryResp}`,
            labels: {
                "origin": "db"
            }
        });
        return "Cannot allow patient.";
    }
    logger.info({
        message: "UnlimitedUploads allowed",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

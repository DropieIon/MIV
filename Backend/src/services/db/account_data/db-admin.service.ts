import mariadb from 'mariadb';
import { sq } from '../db-functions';
import { logger } from '../../../utils/logger';

export async function dbPromotePat(patient_username: string) {
    let query_resp = await sq('update login set role = "med" where username = ? and role = "pat"',
        [patient_username])
    if(query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            logger.error({
                message: `Database update error ${query_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            })
            return "Database update error";
        }
    }
    query_resp = await sq('delete from requests where patient_username = ?',
        [patient_username]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            logger.error({
                message: `Database deletion error ${query_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return "Database deletion error";
        }
    }
    logger.info({
        message: "Patient promoted",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function dbDemotePat(docUsername: string) {
    const query_resp = await sq('update login set role = "pat" where username = ? and role = "med"',
        [docUsername])
    if(query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            return "Database update error";
        }
    }
    return "";
}

export async function dbPatIsAssigned(patUsername: string) {
    const query_resp = await sq('select patient_username from patients_assigned where patient_username = ?',
        [patUsername])
    if(query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            logger.error({
                message: `Database selection error ${query_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return "Database selection error";
        }
        if(query_resp.length > 0) {
            logger.info({
                message: "Patient is assigned",
                labels: {
                    "origin": "db"
                }
            });
            return "Patient is assigned";
        }
    }
    logger.info({
        message: "Patient is not assigned",
        labels: {
            "origin": "db"
        }
    });
    return "";
}
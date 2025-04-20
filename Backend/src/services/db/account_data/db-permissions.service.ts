import mariadb from 'mariadb';
import { sq } from '../db-functions';
import { logger } from '../../../utils/logger';

export async function assign_study(patient_username: string, study_id: string) {
    const query_resp = await sq('insert into studies_assigned(patient_username, study_id) values (?, ?)',
        [patient_username, study_id])
    if(query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                logger.error({
                    message: "Study already assigned to patient",
                    labels: {
                        "origin": "db"
                    }
                });
                return "Study already assigned to patient";
            }
            logger.error({
                message: `Database insertion error ${query_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return "Database insertion error";
        }
    }
    logger.info({
        message: "Study assigned to patient",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function list_studies(patient_username: string): Promise<string[] | string> {
    const sql_resp = await sq<{study_id: string}>
        ('select study_id from studies_assigned where patient_username=?',
        [patient_username])
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        let resp_list: string[] = [];
        for(let i = 0; i < sql_resp.length; i++)
            resp_list.push(sql_resp[i].study_id)
        logger.info({
            message: "Got studies list",
            labels: {
                "origin": "db"
            }
        });
        return resp_list;
    }
    logger.error({
        message: "Cannot get studies list",
        labels: {
            "origin": "db"
        }
    });
    return "Cannot get studies list";
}


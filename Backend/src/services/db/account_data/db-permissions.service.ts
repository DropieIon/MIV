import mariadb from 'mariadb';
import { sq } from '../db-functions';

export async function assign_study(patient_username: string, study_id: string) {
    const query_resp = await sq('insert into studies_assigned(patient_username, study_id) values (?, ?)',
        [patient_username, study_id])
    if(query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                return "Study already assigned to patient";
            }
            return "Database insertion error";
        }
    }
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
        return resp_list;
    }
    return "Cannot get studies list";
}


import mariadb from 'mariadb';
import { sq } from '../db-functions';

export async function db_get_requests(username: string, isMedic: 'Y' | 'N'): Promise<string | any[]> {
    const medic = isMedic === 'Y';
    const whichUsername = medic ? 'patient_username' : 'doctor_username';
    const sql_resp = await sq(
        `select r.${whichUsername}, pd.full_name, r.accepted, r.date, pp.profile_pic \
        from requests r \
        left join profile_pictures pp on r.${whichUsername} = pp.username \
        left join personal_data pd on r.${whichUsername} = pd.username \
        where r.${medic ? 'doctor_username' : 'patient_username'}=?`
        , [username]);
    
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        return sql_resp;
    }
    return "";
}

export async function db_insert_patient_requests(username: string, to: string): Promise<string> {
    const query_resp = await sq('insert into requests(patient_username, doctor_username, date) values (?, ?, NOW())',
        [username, to]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                return "Request already requested";
            }
            return "Database insertion error " + query_resp.sqlMessage;
        }
    }
    return "";
}

export async function db_ans_request(acc: boolean, doc_username: string, pat_username: string)
    : Promise<string>
{
    let query_resp;
    if(acc) {
        // accept the request
        query_resp = await sq('insert into patients_assigned(\
            doctor_username, patient_id, patient_username) \
            values (?, (select uuid from login where username = ?), ?)',
        [doc_username, pat_username, pat_username]);
        if (query_resp !== "") {
            if (query_resp instanceof mariadb.SqlError) {
                if (query_resp.code === "ER_DUP_ENTRY") {
                    return "Request already answered";
                }
                return "Database insertion error " + query_resp.sqlMessage;
            }
        }
    }
    // and then delete the request
    query_resp = await sq('delete from requests \
    where doctor_username = ? \
    and patient_username = ?',
    [doc_username, pat_username]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            return "Database deletion error " + query_resp.sqlMessage;
        }
    }
    return "";

}
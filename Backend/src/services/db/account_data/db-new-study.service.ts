import { sq } from "../db-functions";
import mariadb from 'mariadb';

export async function dbNewStudy(patUsername: string, studyId: string): Promise<string> {
    const query_resp = await sq(
        'insert into studies_assigned(patient_username, study_id) values (?, ?)',
        [patUsername, studyId]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                return "Study id already assigned";
            }
            return "Database insertion error " + query_resp.sqlMessage;
        }
    }
    return "";
}
import { sq } from "../db-functions";
import mariadb from 'mariadb';

export async function dbNewStudy(patUsername: string, studyId: string): Promise<string> {
    const query_resp = await sq(
        'insert into studies_assigned(patient_username, study_id, uploaded) values (?, ?, NOW())',
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

export async function dbCheckStudyID(patUsername: string, studyId: string): Promise<string | boolean> {
    const queryResp = await sq(
        'select patient_username from studies_assigned \
        where patient_username = ? \
        and study_id = ?',
        [patUsername, studyId]);
        if (typeof queryResp !== "string" && !(queryResp instanceof mariadb.SqlError)) {
            // it's the resp list
            if(queryResp.length === 0)
                return true;
            return false;
        }
        return "Cannot get studies list";
}

export async function dbAssignStudy(studyID: string, patUsername: string): Promise<string> {
    const queryResp = await sq(
        'update studies_assigned set patient_username = ?, uploaded = uploaded where study_id = ?',
        [patUsername, studyID]);
    if (queryResp !== "") {
        if (queryResp instanceof mariadb.SqlError) {
            return "Database insertion error " + queryResp.sqlMessage;
        }
    }
    return "";
}
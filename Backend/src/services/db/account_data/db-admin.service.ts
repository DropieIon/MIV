import mariadb from 'mariadb';
import { sq } from '../db-functions';

export async function dbPromotePat(patient_username: string) {
    let query_resp = await sq('update login set role = "med" where username = ? and role = "pat"',
        [patient_username])
    if(query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            return "Database update error";
        }
    }
    query_resp = await sq('delete from requests where patient_username = ?',
        [patient_username]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            return "Database deletion error";
        }
    }
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
            return "Database selection error";
        }
        if(query_resp.length > 0) {
            return "Patient is assigned";
        }
    }
    return "";
}
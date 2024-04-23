import mariadb from 'mariadb';
import { loginForm, registerForm, yayOrNay } from '../../../types/auth/authentication.type';
import { sha256 } from '../../../utils/helper.util';
import { patientForm } from "../../../types/auth/authentication.type";
import { sq } from '../db-functions';

type checkLogin_resp = { isMedic: yayOrNay, email_validation: yayOrNay, fullName: string };

export async function dbCanUpload(username: string)
    : Promise<string | boolean> {
    const queryResp = await sq(
        'select COUNT(*) c from patients_assigned where patient_username = ?',
        [username]
    );
    if (queryResp !== "") {
        if (queryResp instanceof mariadb.SqlError) {
            return "Database upload check error";
        }
        if (typeof queryResp !== "string") {
            // is the resp list
            if(parseInt(queryResp[0].c) === 0)
                return false;
            return true;
        }
    }
    return "";
}

export async function insert_user(registerData: registerForm, uuid: string): Promise<string> {
    const { email, username, password } = registerData;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        return "Invalid email!";
    let query_resp = await sq('insert into login(username, passhash, email, uuid, isMedic) values (?, ?, ?, ?, ?)',
        [username, sha256(password), email, uuid, 'N']);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                return "Email or username already in use";
            }
            return "Database insertion error";
        }
    }
    return "";
}

export async function validateUUID(uuid: string) {
    const sql_resp = await sq('update login set email_validation="Y" where uuid=?',
        [uuid]);
    if (sql_resp instanceof mariadb.SqlError) {
        return "Database update error";
    }
    if ((sql_resp as { affectedRows: number }).affectedRows !== 1)
        return "Cannot validate uuid";
    return "";
}

export async function checkLogin(loginData: loginForm): Promise<string | checkLogin_resp> {
    const { username, password } = loginData;
    const sql_resp = await sq<checkLogin_resp>(
        'select l.isMedic, l.email_validation, pd.full_name \
        from login l \
        left join personal_data pd on l.username = pd.username \
        where l.username=? and l.passhash=?',
        [username, sha256(password)]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        // is the resp list
        if (sql_resp.length == 0)
            return "Invalid credentials";
        return { 
            isMedic: sql_resp[0].isMedic,
            email_validation: sql_resp[0].email_validation,
            fullName: sql_resp[0].full_name
        };
    }
    return "Cannot login";
}

export async function insert_patient_details(username: string, details: patientForm) {
    let insert_resp = await sq('insert into personal_data (username, full_name, age, sex) values (?, ?, ?, ?)',
        [username, details.fullName, details.age, details.sex]);
    if (insert_resp !== "") {
        if (insert_resp instanceof mariadb.SqlError) {
            if (insert_resp.code === "ER_NO_REFERENCED_ROW") {
                return "Patient already has the required data";
            }
            return "Database insertion error";
        }
    }
    insert_resp = await sq('insert into profile_pictures (username, profile_pic) values (?, ?)',
        [username, details.profile_picB64]);
    if (insert_resp !== "") {
        if (insert_resp instanceof mariadb.SqlError) {
            if (insert_resp.code === "ER_NO_REFERENCED_ROW") {
                return "Patient already has the required data";
            }
            return "Database insertion error";
        }
    }
    insert_resp = await sq('update login set has_completed=\'Y\' where username=?', [username]);
    if (insert_resp !== "") {
        if (insert_resp instanceof mariadb.SqlError) {
            if (insert_resp.code === "ER_NO_REFERENCED_ROW") {
                return "Patient already has the required data";
            }
            return "Database insertion error";
        }
    }
    return "";
}

export async function has_completed(username: string) {
    let sql_resp = await sq<{ has_completed: yayOrNay }>('select has_completed from login where username=?', [username]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        // is the resp list
        if (sql_resp.length === 0)
            return "User not found";
        return sql_resp[0].has_completed;
    }
    return "";

}


import mariadb from 'mariadb';
import { db_config } from '../../configs/db.config';
import { loginForm, registerForm, yayOrNay } from '../../types/authentication.type';
import { sha256 } from '../../utils/helper.util';
import { patientForm } from "../../types/patients.type";

const pool = mariadb.createPool(db_config);

type checkLogin_resp = { isMedic: yayOrNay, email_validation: yayOrNay }


export function get_pool() {
    return pool;
}

export async function sq<T>(sql: string, values?: (string | number)[]): Promise<"" | mariadb.SqlError | T[] | any> {
    try {
        let rez = await pool.query(sql, values);
        return rez;
    } catch (error) {
        console.error(error);
        return error as mariadb.SqlError;
    }
}

export async function insert_user(registerData: registerForm, uuid: string): Promise<string> {
    const { email, username, password, isMedic } = registerData;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        return "Invalid email!";
    let query_resp = await sq('insert into login(username, passhash, email, uuid, isMedic) values (?, ?, ?, ?, ?)',
        [username, sha256(password), email, uuid, isMedic]);
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
    const sql_resp = await sq<checkLogin_resp>('select isMedic, email_validation from login where username=? and passhash=?',
        [username, sha256(password)]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        // is the resp list
        if (sql_resp.length == 0)
            return "Invalid credentials";
        return { isMedic: sql_resp[0].isMedic, email_validation: sql_resp[0].email_validation };
    }
    return "Cannot login";
}

export async function insert_patient_details(username: string, details: patientForm) {
    let insert_resp = await sq('insert into patients(username, age, sex) values (?, ?, ?)',
        [username, details.age, details.sex]);
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
        if (sql_resp.length == 0)
            return "User not found";
        return sql_resp[0].has_completed;
    }
    return "";

}

export async function db_get_requests(username: string, isMedic: 'Y' | 'N'): Promise<string | any[]> {
    const medic = isMedic === 'Y';
    const whichUsername = medic ? 'patient_username' : 'doctor_username';
    let sql_resp = await sq(
        `select r.${whichUsername}, pd.full_name, r.accepted, r.date, pp.profile_pic \
        from requests r \
        left join profile_pictures pp on r.${whichUsername} = pp.username \
        left join personal_data pd on r.${whichUsername} = pd.username \
        where r.${medic ? 'doctor_username' : 'patient_username'}=?`
        , [username]);
    
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        // is the resp list
        if (sql_resp.length === 0)
            return "No requests or user not found";
        return sql_resp;
    }
    return "";
}

export async function db_insert_patient_requests(username: string, to: string): Promise<string> {
    let query_resp = await sq('insert into requests(patient_username, doctor_username, date) values (?, ?, NOW())',
        [username, to]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                return "Request already requested";
            }
            return "Database insertion error";
        }
    }
    return "";
}
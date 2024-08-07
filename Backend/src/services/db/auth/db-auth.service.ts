import mariadb from 'mariadb';
import { loginForm, registerForm, yayOrNay } from '../../../types/auth/authentication.type';
import { formatName, sha256 } from '../../../utils/helper.util';
import { patientForm } from "../../../types/auth/authentication.type";
import { sq } from '../db-functions';
import { randomBytes } from 'crypto';

type checkLogin_resp = { role: string, email_validation: yayOrNay, fullName: string };

export async function dbCanUpload(username: string)
    : Promise<string | boolean> {
    // this check is just in case a doctor account was demoted recently
    const queryResp = await sq(
        'select COUNT(*) c from patients_assigned \
        where patient_username = ? \
        and doctor_username in (select username from login where role = "med")',
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
    const salt = randomBytes(16).toString('hex');
    let query_resp = await sq('insert into login(username, passhash, salt, email, uuid, role) values (?, ?, ?, ?, ?, ?)',
        [username, sha256(salt + password), salt, email, uuid, 'pat']);
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
    let sqlResp = await sq(
        'select l.salt \
        from login l \
        where l.username=?',
        [username]
    );
    if(typeof sqlResp === "string" || sqlResp instanceof mariadb.SqlError || sqlResp.length === 0)
        return "Error getting salt";
    const salt = sqlResp[0].salt;
    sqlResp = await sq<checkLogin_resp>(
        'select l.role, l.email_validation, pd.full_name \
        from login l \
        left join personal_data pd on l.username = pd.username \
        where l.username=? and l.passhash=?',
        [username, sha256(salt + password)]);
    if (typeof sqlResp !== "string" && !(sqlResp instanceof mariadb.SqlError)) {
        // is the resp list
        if (sqlResp.length === 0) {
            return "Invalid credentials";
        }
        return { 
            role: sqlResp[0].role,
            email_validation: sqlResp[0].email_validation,
            fullName: formatName(sqlResp[0].full_name)
        };
    }
    return "Cannot login";
}

function parseDateToMariadb(date: string) {
    const splitDate = date.split('/')
    // Mariadb format: yyyy-mm-dd
    // recv format: mm-dd-yyyy
    const year = splitDate[2];
    const month = splitDate[0];
    const day = splitDate[1];
    return `${year}-${month}-${day}`
}

export async function insert_patient_details(username: string, details: patientForm, update: boolean) {
    const fullName = details.fullName.toLowerCase();
    const birthday = parseDateToMariadb(details.birthday);
    let insert_resp = await sq(
        'insert into personal_data (username, full_name, birthday, sex) \
        values (?, ?, ?, ?) \
        on duplicate key update full_name = ?, birthday = ?, sex = ?',
        [username, fullName, birthday, details.sex,
            fullName, birthday, details.sex
        ]);
    if (insert_resp !== "") {
        if (insert_resp instanceof mariadb.SqlError) {
            if (insert_resp.code === "ER_NO_REFERENCED_ROW") {
                return "Patient already has the required data";
            }
            return "Database insertion error";
        }
    }
    insert_resp = await sq(
        'insert into profile_pictures (username, profile_pic) \
        values (?, ?) \
        on duplicate key update profile_pic = ?',
        [username, details.profile_picB64, details.profile_picB64]);
    if (insert_resp !== "") {
        if (insert_resp instanceof mariadb.SqlError) {
            if (insert_resp.code === "ER_NO_REFERENCED_ROW") {
                return "Patient already has the required data";
            }
            return "Database insertion error";
        }
    }
    if(!update) {
        insert_resp = await sq('update login set has_completed=\'Y\' where username=?', [username]);
        if (insert_resp !== "") {
            if (insert_resp instanceof mariadb.SqlError) {
                if (insert_resp.code === "ER_NO_REFERENCED_ROW") {
                    return "Patient already has the required data";
                }
                return "Database insertion error";
            }
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


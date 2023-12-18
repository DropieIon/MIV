import mariadb from 'mariadb';
import { db_config } from '../configs/db.config';
import { loginForm, registerForm, yayOrNay } from '../types/authentication.type';
import { sha256 } from '../utils/helper.util';

const pool = mariadb.createPool(db_config);

type checkLogin_resp = { isMedic: yayOrNay, email_validation: yayOrNay }


export function get_pool() {
    return pool;
}

async function sq<T>(sql: string, values?: (string | number)[]): Promise<"" | mariadb.SqlError | T[] | any> {
    let conn: mariadb.PoolConnection | null= null;
    try {
        conn = await pool.getConnection();
        let rez = await conn.query(sql, values);
        conn.end();
        return rez;
    } catch (error) {
        if(conn)
            conn.end();
        console.error(error);
        return error as mariadb.SqlError;
    }
}

export async function insert_user(registerData: registerForm, uuid:string): Promise<string> {
    const { email, username, password, isMedic} = registerData;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        return "Invalid email!";
    let query_resp = await sq('insert into login(username, passhash, email, uuid, isMedic) values (?, ?, ?, ?, ?)', 
    [username, sha256(password), email, uuid, isMedic]);
    if(query_resp !== "")
    {
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
    if(sql_resp instanceof mariadb.SqlError){
        return "Database update error";
    }
    if((sql_resp as {affectedRows: number}).affectedRows !== 1)
        return "Cannot validate uuid";
    return "";
}

export async function checkLogin(loginData: loginForm): Promise<string | checkLogin_resp> {
    const { username, password } = loginData;
    const sql_resp = await sq<checkLogin_resp>('select isMedic, email_validation from login where username=? and passhash=?',
    [username, sha256(password)]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        // is the resp list
        if(sql_resp.length == 0)
            return "Invalid credentials";
        return {isMedic: sql_resp[0].isMedic, email_validation: sql_resp[0].email_validation};
    }
    return "Cannot login";
}
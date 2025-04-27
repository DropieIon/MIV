import mariadb from 'mariadb';
import { loginForm, registerForm, yayOrNay } from '../../../types/auth/authentication.type';
import { formatName, sha256 } from '../../../utils/helper.util';
import { patientForm } from "../../../types/auth/authentication.type";
import { sq } from '../db-functions';
import { randomBytes } from 'crypto';
import { logger } from '../../../utils/logger';

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
            logger.error({
                message: `Database upload check error ${queryResp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return "Database upload check error";
        }
        if (typeof queryResp !== "string") {
            // is the resp list
            if(parseInt(queryResp[0].c) === 0) {
                logger.info({
                    message: "Can't upload",
                    labels: {
                        "origin": "db"
                    }
                });
                return false;
            }
            logger.info({
                message: "Can upload",
                labels: {
                    "origin": "db"
                }
            });
            return true;
        }
    }
    logger.error({
        message: "Cannot get patients list",
        labels: {
            "origin": "db"
        }
    });
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
                logger.error({
                    message: "Email or username already in use",
                    labels: {
                        "origin": "db"
                    }
                });
                return "Email or username already in use";
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
        message: "User inserted",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function validateUUID(uuid: string) {
    const sql_resp = await sq('update login set email_validation="Y" where uuid=?',
        [uuid]);
    if (sql_resp instanceof mariadb.SqlError) {
        logger.error({
            message: `Database update error ${sql_resp.sqlMessage}`,
            labels: {
                "origin": "db"
            }
        });
        return "Database update error";
    }
    if ((sql_resp as { affectedRows: number }).affectedRows !== 1) {
        logger.error({
            message: "Cannot validate uuid",
            labels: {
                "origin": "db"
            }
        });
        return "Cannot validate uuid";
    }
    logger.info({
        message: "UUID validated",
        labels: {
            "origin": "db"
        }
    });
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
    if (sqlResp.length === 0) {
        logger.error({
            message: "User not found",
            labels: {
                "origin": "db"
            }
        });
        return "User not found";
    }
    if(typeof sqlResp === "string" || sqlResp instanceof mariadb.SqlError){
        logger.error({
            message: `Error logging in ${sqlResp}`,
            labels: {
                "origin": "db"
            }
        });
        return "Error logging in";
    }
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
            logger.error({
                message: "Invalid credentials",
                labels: {
                    "origin": "db"
                }
            });
            return "Invalid credentials";
        }
        logger.info({
            message: "Login successful",
            labels: {
                "origin": "db"
            }
        });
        return { 
            role: sqlResp[0].role,
            email_validation: sqlResp[0].email_validation,
            fullName: formatName(sqlResp[0].full_name)
        };
    }
    logger.error({
        message: "Cannot login",
        labels: {
            "origin": "db"
        }
    });
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
                logger.error({
                    message: "Patient already has the required data",
                    labels: {
                        "origin": "db"
                    }
                });
                return "Patient already has the required data";
            }
            logger.error({
                message: `Database insertion error ${insert_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
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
                logger.error({
                    message: "Patient already has the required data",
                    labels: {
                        "origin": "db"
                    }
                });
                return "Patient already has the required data";
            }
            logger.error({
                message: `Database insertion error ${insert_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return "Database insertion error";
        }
    }
    if(!update) {
        insert_resp = await sq('update login set has_completed=\'Y\' where username=?', [username]);
        if (insert_resp !== "") {
            if (insert_resp instanceof mariadb.SqlError) {
                if (insert_resp.code === "ER_NO_REFERENCED_ROW") {
                    logger.error({
                        message: "Patient already has the required data",
                        labels: {
                            "origin": "db"
                        }
                    });
                    return "Patient already has the required data";
                }
                logger.error({
                    message: `Database insertion error ${insert_resp.sqlMessage}`,
                    labels: {
                        "origin": "db"
                    }
                });
                return "Database insertion error";
            }
        }
    }
    logger.info({
        message: "Patient details inserted",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function has_completed(username: string) {
    let sql_resp = await sq<{ has_completed: yayOrNay }>('select has_completed from login where username=?', [username]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        // is the resp list
        if (sql_resp.length === 0) {
            logger.error({
                message: "User not found",
                labels: {
                    "origin": "db"
                }
            });
            return "User not found";
        }
        logger.info({
            message: "Got has_completed",
            labels: {
                "origin": "db"
            }
        });
        return sql_resp[0].has_completed;
    }
    logger.error({
        message: "Cannot get has_completed",
        labels: {
            "origin": "db"
        }
    });
    return "";
}


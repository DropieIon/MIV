import mariadb from 'mariadb';
import { sq } from '../db-functions';


export async function dbGetPfp(username: string): Promise<string | { pfp: string }> {
    const sql_resp = await sq
        ('select profile_pic from profile_pictures where username=?',
        [username]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        if(sql_resp.length > 0)
            return { pfp: sql_resp[0].profile_pic };
        else
            return "No pfp for user";
    }
    return "Cannot get profile picture";
}
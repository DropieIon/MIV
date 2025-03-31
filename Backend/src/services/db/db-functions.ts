import mariadb from 'mariadb';
import { db_config } from '../../configs/db.config';

const pool = mariadb.createPool(db_config);

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
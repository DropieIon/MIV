// types for process.env
declare var process: {
    env: {
        db_host: string,
        db_name: string,
        db_user: string,
        db_pass: string,
    }
}

const env = process.env;

export const db_config = {
    host: env.db_host,
    user: env.db_user,
    password: env.db_pass,
    database: env.db_name,
    connectionLimit: 5,
    multipleStatements: false
};
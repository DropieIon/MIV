// types for process.env
declare var process: {
    env: {
        db_pass: string,
        db_user: string
    }
}

export const db_config = {
    host: 'db_backend',
    user: process.env.db_user,
    password: process.env.db_pass,
    database: 'miv',
    connectionLimit: 5,
    multipleStatements: false
};
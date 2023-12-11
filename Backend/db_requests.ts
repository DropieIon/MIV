import mariadb from 'mariadb';
import { db_config } from './src/configs/db.config';

const pool = mariadb.createPool(db_config);

export function insert_user(username: string, passhash: string) {
  pool.getConnection()
    .then(conn => {
      conn.query('insert into login(username, passhash) values (?, ?)', 
        [username, passhash]).catch((err) => {
          conn.end();
          throw new Error("Insert error: " + err);
        })
    }).catch(err => {
      //not connected
      throw new Error("Connection failed " + err);
    });
}

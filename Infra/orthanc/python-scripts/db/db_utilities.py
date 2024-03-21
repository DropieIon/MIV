import mariadb
import sys

sql_pool = None
try:
    # TODO: get these from env
    sql_pool = mariadb.ConnectionPool(
        user="miv",
        password="secure_miv",
        host="db_auth",
        port=3306,
        database="miv",
        pool_name="orthanc",
        pool_reset_connection = False,
        pool_size=20)
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

def query(sql: str, params: tuple):
    pconn = sql_pool.get_connection()
    cursor = pconn.cursor()
    cursor.execute(sql, params)
    return cursor, pconn
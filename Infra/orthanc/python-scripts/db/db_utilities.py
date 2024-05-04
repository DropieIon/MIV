import mariadb
import sys
from os import environ

def query(sql: str, params: tuple):
    try:
        conn = mariadb.connect(
            host=environ["AUTH_HOST"],
            port=3306,
            database=environ["AUTH_DB"],
            user=environ["AUTH_USER"],
            password=environ["AUTH_PASS"],
            autocommit=True)
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)
    cursor = conn.cursor()
    cursor.execute(sql, params)
    return cursor, conn
from db.db_utilities import query

def cursorWithAllDoctors():
    return query(
"select username \
from login \
where isMedic='Y'", 
    None
)

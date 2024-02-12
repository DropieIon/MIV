from db.db_utilities import query

def cursorWithAllDoctors():
    return query(
"select l.username, d.full_name, d.age, d.sex, l.uuid, pic.profile_pic \
from login l \
join personal_data d on l.username = d.username \
join profile_pictures pic on pic.username = l.username \
where isMedic='Y'", 
    None
)

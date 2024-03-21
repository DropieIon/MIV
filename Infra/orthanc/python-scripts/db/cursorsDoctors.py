from db.db_utilities import query

def cursorWithAllDoctors(pat_username):
    return query(
"select l.username, d.full_name, d.age, d.sex, l.uuid, pic.profile_pic \
from login l \
left join personal_data d on l.username = d.username \
left join profile_pictures pic on pic.username = l.username \
where isMedic='Y' \
and l.username not in (select doctor_username from patients_assigned where patient_username = ?) \
and l.username not in (select doctor_username from requests where patient_username = ?) ", 
    (pat_username, pat_username,)
)

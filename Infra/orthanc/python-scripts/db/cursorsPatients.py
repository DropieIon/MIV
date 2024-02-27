from db.db_utilities import query

def cursorWithPatientsAssigned(doc_username):
    return query(
"select pa.patient_username, pd.full_name, pd.age, pd.sex, pa.patient_id, pic.profile_pic \
from patients_assigned pa \
left join personal_data pd on pa.patient_username=pd.username \
left join profile_pictures pic on pic.username = pa.patient_username \
where pa.doctor_username=?",
            (doc_username,))

def cursorWithAllPatients(doc_username):
    return query(
"select l.username, d.full_name, d.age, d.sex, l.uuid, pic.profile_pic  \
from login l \
left join personal_data d on l.username = d.username \
left join profile_pictures pic on pic.username = l.username \
where isMedic='N' \
and l.username not in (select patient_username from patients_assigned where doctor_username = ?) \
and l.username not in (select patient_username from requests where doctor_username = ?)", 
        (doc_username, doc_username,)
    )

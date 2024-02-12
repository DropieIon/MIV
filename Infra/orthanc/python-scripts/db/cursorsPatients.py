from db.db_utilities import query

def cursorWithPatientsAssigned(doc_username):
    return query(
"select pa.patient_username, pa.patient_id, pd.full_name, pd.age, pd.sex, pa.doctor_username \
from patients_assigned pa \
left join personal_data pd on pa.patient_username=pd.username \
where pa.doctor_username=?",
            (doc_username,))

def cursorWithAllPatients():
    return query(
"select distinct pa.patient_username, pa.patient_id, pd.full_name, pd.age, pd.sex, pa.doctor_username \
from patients_assigned pa \
left join personal_data pd on pa.patient_username=pd.username",
        None
    )

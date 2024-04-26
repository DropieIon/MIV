from db.db_utilities import query

def cursorWithStudyIds(patient_username):
    return query(
        "select study_id, uploaded from studies_assigned where patient_username=?",
        (patient_username,))

def cursorWithStudiesForPatient(patient_id, doc_username):
    return query(
"select sa.study_id, sa.uploaded \
from studies_assigned sa \
join patients_assigned pa on sa.patient_username=pa.patient_username \
where pa.patient_id=? and pa.doctor_username=?",
(patient_id, doc_username,)
    )

def cursorWithAllStudies():
    return query(
"select distinct sa.study_id, pa.patient_id, sa.uploaded \
from studies_assigned sa \
join patients_assigned pa on sa.patient_username=pa.patient_username",
        None
    )
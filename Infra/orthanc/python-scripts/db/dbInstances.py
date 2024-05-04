from db.db_utilities import query

def insertStudyID(study_id):
    cursor, pconn = query(
"insert into studies_assigned(study_id, patient_username, uploaded) \
values (?, NULL, NOW());",
            (study_id,))
    pconn.close()
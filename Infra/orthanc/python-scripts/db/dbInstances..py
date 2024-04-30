from db.db_utilities import query

def insertStudyID(study_id):
    return query(
"insert into studies_assigned(study_id, patient_username) \
values (?, NULL);",
            (study_id,))
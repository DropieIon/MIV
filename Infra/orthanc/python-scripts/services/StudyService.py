from helpers import getUsername
from db.cursorsStudies import cursorWithAllStudies, cursorWithStudyIds
from classes.StudyAssigned import StudyAssigned
def StudyListForUser(request):
    patient_username = getUsername(request)
    cursor, pconn = cursorWithStudyIds(patient_username)
    study_ids = []
    for (study_id,) in cursor:
        study_ids.append(study_id)
    pconn.close()
    return study_ids

def AllStudiesList():
    cursor, pconn = cursorWithAllStudies()
    study_ids = []
    for (study_id, patient_id) in cursor:
        study_ids.append(StudyAssigned(study_id, patient_id))
    pconn.close()
    return study_ids
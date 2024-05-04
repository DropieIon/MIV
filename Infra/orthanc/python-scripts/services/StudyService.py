from helpers import getUsername, convertDate
from db.cursorsStudies import cursorWithAllStudies, cursorWithStudyIds
from classes.StudyAssigned import StudyAssigned
from classes.Study import Study
import orthanc, json
from base64 import b64encode
from logging import info

def getPreviewForStudy(study_id: str) -> str:
    series_id = json.loads(orthanc.RestApiGet(f'/studies/{study_id}'))\
                    ["Series"][0]
    instance_id = json.loads(orthanc.RestApiGet(f'/series/{series_id}'))\
                    ["Instances"][0]
    return b64encode(orthanc.RestApiGet(f'/instances/{instance_id}/preview')).decode('ascii')
    

def getModalityForSeries(series_list: list[str]):
    modality = None
    modality_list = ""
    for series in series_list:
        modality = json.loads(orthanc.RestApiGet(f'/series/{series}'))\
                    ["MainDicomTags"]["Modality"]
        if modality not in modality_list:
            modality_list += modality + ", "
    return modality_list[:-2]

def StudyListForUser(request):
    patient_username = getUsername(request)
    cursor, pconn = cursorWithStudyIds(patient_username)
    study_ids = []
    study_metadata = None
    for (study_id, uploaded,) in cursor:
        study_metadata = json.loads(orthanc.RestApiGet(f'/studies/{study_id}'))
        study_ids.append(Study(study_id, 
                               getModalityForSeries(study_metadata["Series"]), 
                               getPreviewForStudy(study_id),
                               convertDate(study_metadata["MainDicomTags"]["StudyDate"]),
                               uploaded)
                               )
    pconn.close()
    return study_ids

def AllStudiesList():
    cursor, pconn = cursorWithAllStudies()
    info("cursor: %s" % cursor)
    study_ids = []
    study_metadata = None
    for (study_id, uploaded,) in cursor:
        info(study_id)
        study_metadata = json.loads(orthanc.RestApiGet(f'/studies/{study_id}'))
        study_ids.append(Study(
                                study_id, 
                                getModalityForSeries(study_metadata["Series"]), 
                                getPreviewForStudy(study_id),
                                convertDate(study_metadata["MainDicomTags"]["StudyDate"]),
                                uploaded
                               )
                        )
    pconn.close()
    return study_ids
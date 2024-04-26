from pyorthanc import orthanc_sdk
from helpers import getDocUsername, Encoder
from services.PatientService import AllPatientsList, AssignedPatientsList
from db.cursorsStudies import cursorWithStudiesForPatient
import json
from classes.Study import Study
import orthanc
from helpers import convertDate
from services.StudyService import getModalityForSeries, getPreviewForStudy
import logging

def getAssignedPatients(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        doc_username = getDocUsername(request)
        # has to be a doctor for this
        if not doc_username:
            output.SendUnauthorized('Not allowed')
            return
        output.AnswerBuffer(json.dumps(AssignedPatientsList(doc_username), cls=Encoder), 'application/json')
    else:
        output.SendMethodNotAllowed('Not allowed')    

def getAllPatients(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        doc_username = getDocUsername(request)
        if not doc_username:
            output.SendUnauthorized('Not allowed')
            return
        output.AnswerBuffer(json.dumps(AllPatientsList(doc_username), cls=Encoder), 'application/json')
    else:
        output.SendMethodNotAllowed('Not allowed')         

def getStudiesForPatient(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        doc_username = getDocUsername(request)
        # has to be a doctor for this
        if not doc_username:
            output.SendUnauthorized('Not allowed')
            return
        patient_id = uri.split("/")[2]
        cursor, pconn = cursorWithStudiesForPatient(patient_id, doc_username)
        studies_list = []
        for (study_id, uploaded,) in cursor:
            study_metadata = json.loads(orthanc.RestApiGet(f'/studies/{study_id}'))
            studies_list.append(Study(study_id, 
                               getModalityForSeries(study_metadata["Series"]), 
                               getPreviewForStudy(study_id),
                               convertDate(study_metadata["MainDicomTags"]["StudyDate"]),
                               uploaded)
                               )
        pconn.close()
        output.AnswerBuffer(json.dumps(studies_list, cls=Encoder), 'application/json')
    else:
        output.SendMethodNotAllowed('Not allowed')    

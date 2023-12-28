from pyorthanc import orthanc_sdk
import orthanc
from helpers import getDocUsername, Encoder, getUsername, checkAccess
from services.StudyService import StudyListForUser, AllStudiesList
import json
import logging

def getStudiesForUser(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        study_ids = StudyListForUser(request)
        output.AnswerBuffer(json.dumps(study_ids, cls=Encoder), 'application/json')
    else:
        output.SendMethodNotAllowed('Not allowed')

def getAllStudies(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        # check if it's medic
        if not getDocUsername(request):
            output.SendUnauthorized('Not allowed')
            return    
        study_ids = AllStudiesList()
        output.AnswerBuffer(json.dumps(study_ids, cls=Encoder), 'application/json')
    else:
        output.SendMethodNotAllowed('Not allowed')

def getStudyData(output: orthanc_sdk.RestOutput, uri: str, **request):
    study_id = uri.split("/")[2]
    if request['method'] == 'GET':
        patient_username = getUsername(request)
        if checkAccess(study_id, patient_username):
            output.AnswerBuffer(
                orthanc.RestApiGet(f'/studies/{study_id}'),
                'application/json')
        else:
            output.SendUnauthorized('Not allowed')
    elif request['method'] == 'POST':
        if not getDocUsername(request):
            logging.info("Nasol")
            output.SendUnauthorized('Not allowed')
            return
        output.AnswerBuffer(
                orthanc.RestApiGet(f'/studies/{study_id}'),
                'application/json')
    else:
        output.SendMethodNotAllowed('Not allowed')
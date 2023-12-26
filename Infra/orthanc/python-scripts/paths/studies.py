from pyorthanc import orthanc_sdk
from helpers import getDocUsername, Encoder
from services.StudyService import StudyListForUser, AllStudiesList
import json
import logging

def getStudiesForUser(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        study_ids = StudyListForUser(request)
        output.AnswerBuffer(json.dumps(study_ids), 'application/json')
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
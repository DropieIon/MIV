from pyorthanc import orthanc_sdk
from helpers import getUsername, checkAccess, getDocUsername
from services.StudyService import StudyListForUser
import json
import orthanc

def getSeries(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        study_ids = StudyListForUser(request)
        series_list = []
        for study_id in study_ids:
            series_list += json.loads(orthanc.RestApiGet(
                f"/studies/{study_id}"))["Series"]
        output.AnswerBuffer(json.dumps(series_list), 'application/json')
        
    else:
        output.SendMethodNotAllowed('Not allowed')

def getSeriesData(output: orthanc_sdk.RestOutput, uri: str, **request):
    series_id = uri.split("/")[2]
    if request['method'] == 'GET':
        patient_username = getUsername(request)
        parent_study = None
        try:
            parent_study = json.loads(orthanc.RestApiGet(
            f"/series/{series_id}/"))\
            ["ParentStudy"]
        except:
            output.SendHttpStatusCode(404)
            return
        if checkAccess(parent_study, patient_username):
            output.AnswerBuffer(
                orthanc.RestApiGet(f'/series/{series_id}'),
                'application/json'
            )
        else:
            output.SendUnauthorized('Not allowed')
    elif request['method'] == 'POST':
        if not getDocUsername(request):
            output.SendUnauthorized('Not allowed')
            return
        output.AnswerBuffer(
                orthanc.RestApiGet(f'/series/{series_id}'),
                'application/json'
            )
    else:
        output.SendMethodNotAllowed('Not allowed')
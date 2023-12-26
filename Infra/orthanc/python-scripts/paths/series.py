from pyorthanc import orthanc_sdk
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

from pyorthanc import orthanc_sdk
import json
import orthanc
from helpers import checkAccess, getUsername, getDocUsername
def getInstaces(output: orthanc_sdk.RestOutput, uri: str, **request):
    instance_id = uri.split("/")[2]
    if request['method'] == 'GET':
        parent_series = json.loads(orthanc.RestApiGet(
            f"/instances/{instance_id}/"))\
            ["ParentSeries"]
        parent_study = json.loads(orthanc.RestApiGet(
            f"/series/{parent_series}/"))\
            ["ParentStudy"]
        # has_access = process_pool.apply(processRequest, args=(parent_study, request,), kwds={})
        patient_username = getUsername(request)
        has_access = checkAccess(parent_study, patient_username)
        if has_access:
            output.AnswerBuffer(orthanc.RestApiGet(
                f'/instances/{instance_id}/rendered'), 'binary')
        else:
            output.SendUnauthorized('Not allowed')
    elif request['method'] == 'POST':
        if not getDocUsername(request):
            output.SendUnauthorized('Not allowed')
            return
        output.AnswerBuffer(orthanc.RestApiGet(
                f'/instances/{instance_id}/rendered'), 'binary')
    else:
        output.SendMethodNotAllowed('Not allowed')
        

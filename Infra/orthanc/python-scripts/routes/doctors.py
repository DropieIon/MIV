from pyorthanc import orthanc_sdk
from helpers import Encoder
from services.DoctorsService import AllDoctorsList
import json
import logging

def getAllDoctors(output: orthanc_sdk.RestOutput, uri: str, **request):
    if request['method'] == 'GET':
        output.AnswerBuffer(json.dumps(AllDoctorsList(), cls=Encoder), 'application/json')
    else:
        output.SendMethodNotAllowed('Not allowed')
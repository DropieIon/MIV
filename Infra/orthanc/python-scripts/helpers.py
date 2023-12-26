from timed_cache import timed_lru_cache
import json
import base64
from db.cursorsStudies import cursorWithStudyIds
import logging

# make class json serializable
class Encoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__

def getDocUsername(request):
    encoded_payload = request['headers']['authorization']\
                                        .split(" ")[1].split(".")[1] + '=='
    json_payload = json.loads(base64.b64decode(encoded_payload))
    if json_payload["isMedic"] != 'Y':
        return None
    return json_payload["username"]

def getUsername(request):
    encoded_payload = request['headers']['authorization']\
                                        .split(" ")[1].split(".")[1] + '=='
    return json.loads(base64.b64decode(encoded_payload))["username"]

@timed_lru_cache(seconds=300, maxsize=32)
def checkAccess(parent_study, patient_username):
    cursor, pconn = cursorWithStudyIds(patient_username)
    has_access = False
    for (study_id,) in cursor:
        if study_id == parent_study:
            has_access = True
            break
    pconn.close()
    return has_access
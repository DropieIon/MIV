import orthanc
from logging import info, error
from requests import get
import json

def get_study_uid(study_id):
    response = orthanc.RestApiGet(f'/studies/{study_id}')
    study_metadata = json.loads(response)
    study_uid = study_metadata["MainDicomTags"]["StudyInstanceUID"]
    return study_uid

def SendOnStableEvent(changeType, level, resourceId):
    if changeType == orthanc.ChangeType.STABLE_STUDY:
        info('Stable study: %s' % resourceId)
        try:
            get(f'http://account_data:3000/on-stable/{get_study_uid(resourceId)}')
        except Exception as e:
            error(e)

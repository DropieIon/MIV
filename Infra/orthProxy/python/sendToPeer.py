import orthanc
import logging
import sys
from os import environ
from requests import post
from timed_cache import timed_lru_cache

base_url = environ["PACS_URL"]
# logger options
root = logging.getLogger()
root.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s p%(process)d %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root.addHandler(handler)
info = logging.info


@timed_lru_cache(seconds=300, maxsize=32)
def get_token(user):
    return post(f'{base_url}/login', json={
            "username": environ["USER_MIV"], "password": environ["PASS_MIV"]
            }).json()['token']

def OnChange(changeType, level, resourceId):
    if changeType == orthanc.ChangeType.NEW_INSTANCE:
        token_proxy = get_token('p')
        headers = {
            'Authorization': f'Bearer {token_proxy}'
        }
        info("Sending instance: %s" % resourceId)
        resp = post(f'{base_url}/instances', {
            "data" : orthanc.RestApiGet(f'/instances/{resourceId}/file'), 
            "id": resourceId
            }, headers=headers)
        if resp.status_code != 200:
            info("Failed sending instance, status code %s" % resp.status_code)
        # delete instance
        orthanc.RestApiDelete(f'/instances/{resourceId}')
        

orthanc.RegisterOnChangeCallback(OnChange)

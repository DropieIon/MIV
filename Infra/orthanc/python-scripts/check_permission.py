import json
import orthanc
import requests
import json
import logging
import sys
import mariadb
import json
import base64
from pyorthanc import orthanc_sdk
import multiprocessing
import signal

def Initializer():
    signal.signal(signal.SIGINT, signal.SIG_IGN)

sql_pool = None
try:
    # TODO: get these from env
    sql_pool = mariadb.ConnectionPool(
        user="miv",
        password="secure_miv",
        host="db_permissions",
        port=3306,
        database="miv",
        pool_name="orthanc",
        pool_reset_connection = False,
        pool_size=20)
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

root = logging.getLogger()
root.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s p%(process)d %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root.addHandler(handler)


def Filter(uri, **request):
    body = {
        'uri' : uri,
        'headers' : request['headers']
    }
    logging.info("Test")
    r = requests.post('http://localhost:8000/authorize',
                      data = json.dumps(body))
    return r.json() ['granted']  # Must be a Boolean

# orthanc.RegisterIncomingHttpRequestFilter(Filter)

test = "da"

def processRequest(parent_study, request):
    encoded_username = request['headers']['authorization']\
                                        .split(" ")[1].split(".")[1] + '='
    patient_username = json.loads(base64.b64decode(encoded_username))["username"]
    pconn = sql_pool.get_connection()
    cursor = pconn.cursor()
    cursor.execute("select study_id from studies_assigned where patient_username=?",
                (patient_username,))
    has_access = False
    for (study_id) in cursor:
        # logging.info(study_id)
        if study_id[0] == parent_study:
            has_access = True
            break
    pconn.close()
    return has_access

# process_pool = multiprocessing.Pool(multiprocessing.cpu_count() - 1, initializer = Initializer)

def OnRest(output: orthanc_sdk.RestOutput, uri: str, **request):
    global test
    if request['method'] == 'GET':
        path_as_list = uri.split("/")
        if len(path_as_list) == 2:
            output.AnswerBuffer(orthanc.RestApiGet('/instances'), "application/text")
            return
        instance_id = path_as_list[2]
        parent_series = json.loads(orthanc.RestApiGet(
            f"/instances/{instance_id}/"))\
            ["ParentSeries"]
        parent_study = json.loads(orthanc.RestApiGet(
            f"/series/{parent_series}/"))\
            ["ParentStudy"]
        # logging.info(parent_study)
        # has_access = process_pool.apply(processRequest, args=(parent_study, request,), kwds={})
        has_access = processRequest(parent_study, request)
        if has_access:
            output.AnswerBuffer(orthanc.RestApiGet(
                f'/instances/{instance_id}/rendered'), 'binary')
        else:
            output.SendUnauthorized('Not allowed')
        


orthanc.RegisterRestCallback('/instances/(.*)', OnRest)

# output object methods:
#['AnswerBuffer', 'CompressAndAnswerJpegImage', 'CompressAndAnswerPngImage', 'Redirect', 'SendHttpStatus', 'SendHttpStatusCode', 'SendMethodNotAllowed', 'SendMultipartItem', 
#'SendUnauthorized', 'SetCookie', 'SetHttpErrorDetails', 'SetHttpHeader', 'StartMultipartAnswer']
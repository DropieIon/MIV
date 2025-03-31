from db.dbInstances import assignToPat
from json import dumps, loads
import orthanc
from timed_cache import timed_lru_cache
from logging import error

@timed_lru_cache(seconds=300, maxsize=32)
def registerStudy(StudyInstanceUID, patFullName: str, patBDay, patSex):
    search = dumps({"Level" : "Study", "Expand":True, "Query" : {"StudyInstanceUID" :  StudyInstanceUID } })
    resp = orthanc.RestApiPost('/tools/find', search)
    try:
        study_id = loads(resp)[0]["ID"]
        patName = patFullName.replace('^', " ").lower()
        patBDayParsed = patBDay[:4] + "-" + patBDay[4:6] + "-" + patBDay[6:8]
        assignToPat(study_id, patName, patBDayParsed, patSex)
    except Exception as err:
        error("Could not insert study id: %s" % err)
        return None

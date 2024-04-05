import orthanc
import logging
import sys
from routes.studies import getStudiesForUser, getAllStudies, getStudyData
from routes.series import getSeries, getSeriesData
from routes.instances import getInstaces
from routes.patients import getAssignedPatients, getStudiesForPatient, getAllPatients

# logger options
root = logging.getLogger()
root.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s p%(process)d %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root.addHandler(handler)


# routes
orthanc.RegisterRestCallback('/instances/(.*)', getInstaces)

orthanc.RegisterRestCallback('/studies', getStudiesForUser)
orthanc.RegisterRestCallback('/studies/(.*)', getStudyData)
orthanc.RegisterRestCallback('/all_studies', getAllStudies)

orthanc.RegisterRestCallback('/series', getSeries)
orthanc.RegisterRestCallback('/series/(.*)', getSeriesData)

orthanc.RegisterRestCallback('/patients/(.*)', getStudiesForPatient)

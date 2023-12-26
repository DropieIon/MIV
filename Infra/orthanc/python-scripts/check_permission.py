import orthanc
import logging
import sys
from paths.studies import getStudiesForUser, getAllStudies
from paths.series import getSeries
from paths.instances import getInstaces
from paths.patients import getAssignedPatients, getStudiesForPatient, getAllPatients
from paths.doctors import getAllDoctors

# logger options
root = logging.getLogger()
root.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s p%(process)d %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root.addHandler(handler)


# Paths
orthanc.RegisterRestCallback('/instances/(.*)', getInstaces)

orthanc.RegisterRestCallback('/studies', getStudiesForUser)
orthanc.RegisterRestCallback('/all_studies', getAllStudies)

orthanc.RegisterRestCallback('/series', getSeries)

orthanc.RegisterRestCallback('/patients', getAssignedPatients)
orthanc.RegisterRestCallback('/all_patients', getAllPatients)
orthanc.RegisterRestCallback('/patients/(.*)', getStudiesForPatient)

orthanc.RegisterRestCallback('/all_doctors', getAllDoctors)

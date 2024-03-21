from db.cursorsPatients import cursorWithAllPatients, cursorWithPatientsAssigned
from classes.Patient import Patient

def AssignedPatientsList(doc_username):
    cursor, pconn = cursorWithPatientsAssigned(doc_username)
    patients_list = []
    for (patient_username, full_name, age, sex, patient_id, profile_pic) in cursor:
        patients_list.append(Patient(username=patient_username,
                                    age=age, sex=sex, 
                                    full_name=full_name,
                                    uid=patient_id,
                                    profile_pic=profile_pic))
    pconn.close()
    return patients_list

def AllPatientsList(doc_username):
    cursor, pconn = cursorWithAllPatients(doc_username)
    patients_list = []
    for (patient_username, full_name, age, sex, patient_id, profile_pic) in cursor:
        patients_list.append(Patient(username=patient_username,
                                    age=age, sex=sex, 
                                    full_name=full_name,
                                    uid=patient_id,
                                    profile_pic=profile_pic))
    pconn.close()
    return patients_list
from db.cursorsPatients import cursorWithAllPatients, cursorWithPatientsAssigned
from classes.Patient import Patient

def AssignedPatientsList(doc_username):
    cursor, pconn = cursorWithPatientsAssigned(doc_username)
    patients_list = []
    for (patient_username, patient_id, full_name, age, sex, doctor_username) in cursor:
        patients_list.append(Patient(patient_username, age, sex, 
                                     full_name, patient_id, doctor_username))
    pconn.close()
    return patients_list

def AllPatientsList():
    cursor, pconn = cursorWithAllPatients()
    patients_list = []
    for (patient_username, patient_id, full_name, age, sex, doctor_username) in cursor:
        patients_list.append(Patient(patient_username, age, sex, 
                                     full_name, patient_id, doctor_username))
    pconn.close()
    return patients_list
from db.cursorsDoctors import cursorWithAllDoctors
from classes.Doctor import Doctor

def AllDoctorsList():
    cursor, pconn = cursorWithAllDoctors()
    doctor_list = []
    for (username, full_name, age, sex, uuid, profile_pic) in cursor:
        doctor_list.append(Doctor(username, full_name, age, sex, uuid, profile_pic))
    pconn.close()
    return doctor_list


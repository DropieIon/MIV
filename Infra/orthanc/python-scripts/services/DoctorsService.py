from db.cursorsDoctors import cursorWithAllDoctors
from classes.Doctor import Doctor

def AllDoctorsList():
    cursor, pconn = cursorWithAllDoctors()
    doctor_list = []
    for (username,) in cursor:
        doctor_list.append(Doctor(username))
    pconn.close()
    return doctor_list


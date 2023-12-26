class Patient(object):
    def __init__(self, username, age, sex, full_name, uid, doctor_username):
        self.username = username
        self.uid    = uid
        self.age    = age
        self.sex    = sex
        self.full_name   = full_name
        self.doctor_username = doctor_username
class Patient(object):
    def __init__(self, username, age, sex, full_name, uid, profile_pic):
        self.username = username
        self.uid    = uid
        self.age    = age
        self.sex    = sex
        self.full_name   = full_name
        self.profile_pic = profile_pic
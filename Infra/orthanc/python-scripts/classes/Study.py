import time

class Study(object):
    def __init__(self, study_id, modality, previewB64, date, uploaded):
        self.study_id = study_id
        self.modality = modality
        self.previewB64 = previewB64
        self.date = date
        self.uploaded = int(time.mktime(uploaded.timetuple())) * 1000

import time
class StudyAssigned(object):
    def __init__(self, study_id, modality, date, previewB64, assignee, uploaded):
        self.study_id = study_id
        self.modality = modality
        self.date = date
        self.previewB64 = previewB64
        self.assignee = assignee
        self.uploaded = int(time.mktime(uploaded.timetuple())) * 1000
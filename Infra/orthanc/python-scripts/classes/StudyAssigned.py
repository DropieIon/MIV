
class StudyAssigned(object):
    def __init__(self, study_id, modality, date, previewB64, assignee):
        self.study_id = study_id
        self.modality = modality
        self.date = date
        self.previewB64 = previewB64
        self.assignee = assignee
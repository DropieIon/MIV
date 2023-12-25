CREATE TABLE patients_assigned (
    doctor_username char(255) NOT NULL,
    patient_username char(255) NOT NULL,
    PRIMARY KEY(doctor_username, patient_username)
);

CREATE TABLE studies_assigned (
    patient_username char(255) NOT NULL,
    study_id char(255) NOT NULL,
    PRIMARY KEY(patient_username, study_id)
);
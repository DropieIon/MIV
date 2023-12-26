CREATE TABLE patients_assigned (
    doctor_username char(255) NOT NULL,
    patient_id char(255) NOT NULL,
    patient_username char(255) NOT NULL,
    PRIMARY KEY(doctor_username, patient_username)
);

CREATE TABLE studies_assigned (
    patient_username char(255) NOT NULL,
    study_id char(255) NOT NULL,
    PRIMARY KEY(patient_username, study_id)
);

# Mock data

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    '750255f1-a6d57cdf-6f7692af-b6eb20e8-76b2cd54'
);

INSERT INTO patients_assigned(
    doctor_username,
    patient_id,
    patient_username
    )
VALUES (
    'doctor',
    '5bdc989c-ac10-4ffd-aa06-74cd69720089',
    'da'
);
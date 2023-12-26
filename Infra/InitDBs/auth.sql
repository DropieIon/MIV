CREATE TABLE login(
    username            char(255) NOT NULL,
    uuid                char(255) not null,
    passhash            char(255) NOT NULL,
    email               char(255) NOT NULL,
    isMedic             char(1) not null, # Y or N
    has_completed       char(1) not null default 'N', # Y or N
    email_validation    char(1) not null default 'N', # Y or N
    primary key (username),
    CONSTRAINT uuid_unique UNIQUE (uuid),
    CONSTRAINT email_unique UNIQUE (email)
);

CREATE TABLE patients_data(
    username            char(255) NOT NULL,
    full_name           char(255) not null,
    age                 int NOT NULL,
    sex                 char(1) NOT NULL,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT `fk_username`
        FOREIGN KEY (username) REFERENCES login (username)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

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

INSERT INTO login(
    username,
    uuid,
    passhash,
    email,
    isMedic,
    has_completed,
    email_validation
)
VALUES (
    'patient',
    '5bdc989c-ac10-4ffd-aa06-74cd69720089',
    '3086cf468ccca87cc7840e0755947526a039eea35f486002d7f1c53d7c58686a',
    'ion@i.com',
    'N',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    email,
    isMedic,
    has_completed,
    email_validation
)
VALUES (
    'doctor',
    'ceva_uid',
    '3086cf468ccca87cc7840e0755947526a039eea35f486002d7f1c53d7c58686a',
    'ion@io.com',
    'Y',
    'Y',
    'Y'
);

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
    'patient'
);

INSERT INTO patients_assigned(
    doctor_username,
    patient_id,
    patient_username
    ) 
VALUES (
    'test_doc',
    '888777',
    'testulescu'
);
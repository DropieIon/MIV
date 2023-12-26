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
/* INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    'ec6cfbd6-364237fe-56813031-bd264f2b-ee084354'
);
*/

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    '14d74df9-be0fb9f4-a88c5382-55c94913-b46b297a'
);
/*
INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    '41abfc37-017aa274-3d25d5fb-7083b369-6b9f0838'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    'e2961f20-e2210b0d-f5dcbf8c-e5735d1c-5331274b'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    '5b4fe3b3-365c4cff-0bcb456e-eafddbc7-2a053734'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    '56bcf14e-94520693-73dff50f-382d1dde-e3cc7870'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    '6dd77db5-ac801ee9-781aa3b6-f02b5237-0320cb04'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    '81a1e4e8-813d4052-7169c282-40be39db-444b75e0'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    'f01fc01f-c70ec7bd-290c49d8-58310aab-3cd3b24f'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient',
    'd9d1b581-d614e90d-8f4d63a9-ff811dd2-35108ab8'
); */
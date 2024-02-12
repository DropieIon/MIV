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

CREATE TABLE personal_data(
    username            char(255) NOT NULL,
    full_name           char(255) not null,
    age                 int NOT NULL,
    sex                 char(1) NOT NULL,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT `fk_personal_data_username`
        FOREIGN KEY (username) REFERENCES login (username)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

CREATE TABLE profile_pictures(
    username            char(255) NOT NULL,
    # image stored as base64 string
    profile_pic         mediumtext,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT `fk_profile_picture_username`
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
    'patient1',
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
    'patient2',
    '5bdc989c-ac10-4ffd-aa06-74cd69720090',
    '3086cf468ccca87cc7840e0755947526a039eea35f486002d7f1c53d7c58686a',
    'ion@ia.com',
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
    'doctor1',
    'ceva_uid1',
    '3086cf468ccca87cc7840e0755947526a039eea35f486002d7f1c53d7c58686a',
    'ion1@io.com',
    'Y',
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
    'doctor2',
    'ceva_uid2',
    '3086cf468ccca87cc7840e0755947526a039eea35f486002d7f1c53d7c58686a',
    'ion2@io.com',
    'Y',
    'Y',
    'Y'
);

# Moc patient data
INSERT INTO personal_data(
    username,
    full_name,
    age,
    sex
)
VALUES (
    'patient1',
    'James Blond',
    22,
    'M'
);

INSERT INTO personal_data(
    username,
    full_name,
    age,
    sex
)
VALUES (
    'patient2',
    'Elodia',
    40,
    'F'
);

# Doc mock data

INSERT INTO personal_data(
    username,
    full_name,
    age,
    sex
)
VALUES (
    'doctor1',
    'Juanito Pecados',
    45,
    'M'
);

INSERT INTO profile_pictures(
    username,
    profile_pic
)
VALUES (
    'doctor1',
    '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'
);

INSERT INTO personal_data(
    username,
    full_name,
    age,
    sex
)
VALUES (
    'doctor2',
    'Margaret Hamilton',
    420,
    'F'
);

INSERT INTO profile_pictures(
    username,
    profile_pic
)
VALUES (
    'doctor2',
    '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'
);

INSERT INTO patients_assigned(
    doctor_username,
    patient_id,
    patient_username
    )
VALUES (
    'doctor1',
    '5bdc989c-ac10-4ffd-aa06-74cd69720089',
    'patient1'
);

INSERT INTO patients_assigned(
    doctor_username,
    patient_id,
    patient_username
    ) 
VALUES (
    'doctor1',
    '5bdc989c-ac10-4ffd-aa06-74cd69720090',
    'patient2'
);

#STUDIES ASSIGNED

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient1',
    '14d74df9-be0fb9f4-a88c5382-55c94913-b46b297a'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient1',
    '8fb3d973-4449cad4-c21bb79d-81c41b56-b9412373'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient1',
    '941a16e6-2b969e8a-d3e9e31a-1bbc74f6-abcad8c3'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient2',
    '9fcadbc3-58807fe5-05a2969e-ab4aafaa-af735eaa'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient2',
    'aa938400-09e9f0df-8ba95f68-e21f98dd-0c6e0cf0'
);

INSERT INTO studies_assigned(
    patient_username,
    study_id
    )
VALUES (
    'patient2',
    '750255f1-a6d57cdf-6f7692af-b6eb20e8-76b2cd54'
);

/*
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
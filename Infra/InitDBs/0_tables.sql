CREATE TABLE login(
    username            char(255) NOT NULL,
    uuid                char(255) not null,
    passhash            char(255) NOT NULL,
    salt                char(16) NOT NULL,
    email               char(255) NOT NULL,
    role                char(5) not null, /* pat, med, admin, or proxy */
    has_completed       char(1) not null default 'N', /* Y or N */
    email_validation    char(1) not null default 'N', /* Y or N */
    primary key (username),
    CONSTRAINT uuid_unique UNIQUE (uuid),
    CONSTRAINT email_unique UNIQUE (email)
);

CREATE TABLE personal_data(
    username            char(255) NOT NULL,
    full_name           char(255) not null,
    birthday            date NOT NULL,
    sex                 char(1) NOT NULL,
    CONSTRAINT username_unique UNIQUE (username),
    constraint check_lowercase_full_name check (lower(full_name) = full_name),
    CONSTRAINT `fk_personal_data_username`
        FOREIGN KEY (username) REFERENCES login (username)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

CREATE TABLE profile_pictures(
    username            char(255) NOT NULL,
    /* image stored as base64 string */
    profile_pic         mediumtext,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT `fk_profile_picture_username`
        FOREIGN KEY (username) REFERENCES login (username)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

CREATE TABLE patients_assigned (
    doctor_username         char(255) NOT NULL,
    patient_id              char(255) NOT NULL,
    patient_username        char(255) NOT NULL,
    PRIMARY KEY(doctor_username, patient_username)
);

CREATE TABLE studies_assigned (
    study_id                char(255) NOT NULL,
    patient_username        char(255) NOT NULL,
    uploaded                timestamp,
    PRIMARY KEY(study_id)
);

CREATE TABLE requests (
    patient_username        char(255) NOT NULL,
    doctor_username         char(255) NOT NULL,
    accepted                char(1) NOT NULL default 'N',
    date                    timestamp,
    PRIMARY KEY(patient_username, doctor_username)
);

CREATE TABLE unlimitedUploads (
    patient_username        char(255) NOT NULL,
    stamp                   timestamp,
    PRIMARY KEY(patient_username)
);

CREATE TABLE bytesUploadedToday (
    patient_username        char(255) NOT NULL,
    bytes                   bigint,
    stamp                   timestamp,
    PRIMARY KEY(patient_username)
);

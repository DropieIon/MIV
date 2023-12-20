CREATE TABLE login(
    username            char(255) NOT NULL,
    uuid                char(255) not null,
    passhash            char(255) NOT NULL,
    email               char(255) NOT NULL,
    isMedic             char(1) not null, # Y or N
    has_completed       char(1) not null default 'N', # Y or N
    email_validation    char(1) not null default 'N', # Y or N
    primary key (username),
    /* CONSTRAINT username_unique UNIQUE (username), */
    CONSTRAINT uuid_unique UNIQUE (uuid),
    CONSTRAINT email_unique UNIQUE (email)
);

CREATE TABLE patients(
    username            char(255) NOT NULL,
    age                 int NOT NULL,
    sex                 char(1) NOT NULL,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT `fk_username`
        FOREIGN KEY (username) REFERENCES login (username)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);
CREATE TABLE login(
    id int not null auto_increment,
    uuid char(255) not null,
    username char(255) NOT NULL,
    passhash char(255) NOT NULL,
    email char(255) NOT NULL,
    isMedic char(1) not null, # Y or N
    email_validation char(1) not null default 'N', # Y or N
    primary key (id),
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT uuid_unique UNIQUE (uuid),
    CONSTRAINT email_unique UNIQUE (email)
);
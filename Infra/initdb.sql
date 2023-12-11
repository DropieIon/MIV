CREATE TABLE login(
    id int not null auto_increment,
    username char(255),
    passhash char(255),
    email_validation char(1) not null default 'N', # Y or N
    primary key (id)
);
/* Logins */

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'patient1',
    '5bdc989c-ac10-4ffd-aa06-74cd69720089',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion@i.com',
    'pat',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'patient2',
    '5bdc989c-ac10-4ffd-aa06-74cd69720090',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion@ia.com',
    'pat',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'patient3',
    '5bdc989c-ac10-4ffd-aa06-74cd697090',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion42@ia.com',
    'pat',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'doctor1',
    'ceva_uid1',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion1@io.com',
    'med',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'doctor2',
    'ceva_uid2',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion2@io.com',
    'med',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'doctor3',
    'ceva_uid3',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion32@io.com',
    'med',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'accept_me1',
    '5bdc989c-ac10-4ffd-aa06-74cd6972089',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion3@i.com',
    'pat',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'accept_me2',
    '5bdc989c-ac10-4ffd-aa06-74cd697200',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion4@i.com',
    'pat',
    'Y',
    'Y'
);

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'tc',
    '5bdc989c-ac10-4ffd-aa06-74cd6972001111111',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion5@i.com',
    'pat',
    'N',
    'Y'
);

/* Admin */

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'talent',
    '5bdc989c-ac10-4ffd-aa06-74cd69720011111100001',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'ion6@i.com',
    'admin',
    'Y',
    'Y'
);

/* Proxy */

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    'proxrox',
    '5bdc989c-ac10-4ffd-aa06-74cd6972001111111111110000',
    '415807834bf7f326e545d7c12db1a7795047b758db585b4e6559fba184a274e7',
    '1234567890198765',
    'ion7@i.com',
    'proxy',
    'Y',
    'Y'
);

/* Only for studies_assigned fk constraint */

INSERT INTO login(
    username,
    uuid,
    passhash,
    salt,
    email,
    role,
    has_completed,
    email_validation
)
VALUES (
    '',
    '5bdc989c-ac10-4ffd-aa06-74cd6972008998',
    'e28be0d62a8386f1053cee00fda6d20121bfafdcb8ec62880b87f7d9c4c77acf',
    '1234567890198765',
    'chiar_nu_cont@i.com',
    'pat',
    'Y',
    'Y'
);
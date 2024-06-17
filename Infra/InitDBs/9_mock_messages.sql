insert into messages (
    username_sender,
    study_id,
    message,
    stamp
)
values (
    'patient1',
    '14d74df9-be0fb9f4-a88c5382-55c94913-b46b297a',
    'Repetăm radiografia?',
    DATE_SUB(NOW(), INTERVAL 2 HOUR)
);

insert into messages (
    username_sender,
    study_id,
    message,
    stamp
)
values (
    'doctor1',
    '14d74df9-be0fb9f4-a88c5382-55c94913-b46b297a',
    'Din fericire, nu.',
    DATE_SUB(NOW(), INTERVAL 1 HOUR)
);

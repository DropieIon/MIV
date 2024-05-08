#STUDIES ASSIGNED

INSERT INTO studies_assigned(
    patient_username,
    study_id,
    uploaded
    )
VALUES (
    'patient1',
    '14d74df9-be0fb9f4-a88c5382-55c94913-b46b297a',
    NOW()
);

INSERT INTO studies_assigned(
    patient_username,
    study_id,
    uploaded
    )
VALUES (
    'patient1',
    '8fb3d973-4449cad4-c21bb79d-81c41b56-b9412373',
    DATE_SUB(NOW(), INTERVAL 1 HOUR)
);

INSERT INTO studies_assigned(
    patient_username,
    study_id,
    uploaded
    )
VALUES (
    'patient1',
    '941a16e6-2b969e8a-d3e9e31a-1bbc74f6-abcad8c3',
    DATE_SUB(NOW(), INTERVAL 2 HOUR)
);

INSERT INTO studies_assigned(
    patient_username,
    study_id,
    uploaded
    )
VALUES (
    'patient2',
    '9fcadbc3-58807fe5-05a2969e-ab4aafaa-af735eaa',
    DATE_SUB(NOW(), INTERVAL 3 HOUR)
);

-- INSERT INTO studies_assigned(
--     patient_username,
--     study_id,
--     uploaded
--     )
-- VALUES (
--     'patient2',
--     'aa938400-09e9f0df-8ba95f68-e21f98dd-0c6e0cf0',
--     DATE_SUB(NOW(), INTERVAL 4 HOUR)
-- );

INSERT INTO studies_assigned(
    patient_username,
    study_id,
    uploaded
    )
VALUES (
    'patient2',
    '750255f1-a6d57cdf-6f7692af-b6eb20e8-76b2cd54',
    DATE_SUB(NOW(), INTERVAL 5 HOUR)
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
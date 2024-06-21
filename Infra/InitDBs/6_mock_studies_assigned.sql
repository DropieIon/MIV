#STUDIES ASSIGNED

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
    '14d74df9-be0fb9f4-a88c5382-55c94913-b46b297a',
    NOW()
);

INSERT INTO studies_assigned(
    patient_username,
    study_id,
    uploaded
    )
VALUES (
    '',
    'aa938400-09e9f0df-8ba95f68-e21f98dd-0c6e0cf0',
    DATE_SUB(NOW(), INTERVAL 4 HOUR)
);

INSERT INTO studies_assigned(
    patient_username,
    study_id,
    uploaded
    )
VALUES (
    'patient2',
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
    '750255f1-a6d57cdf-6f7692af-b6eb20e8-76b2cd54',
    DATE_SUB(NOW(), INTERVAL 5 HOUR)
);


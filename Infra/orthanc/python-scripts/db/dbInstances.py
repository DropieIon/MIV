from db.db_utilities import query
from logging import info

def assignToPat(studyID, fullName, bday, sex):
    cursor, pconn = query(
"select l.username \
from login l \
join personal_data pd on l.username = pd.username \
where pd.full_name = ? \
and pd.sex = ? \
and pd.birthday = ? \
and l.role = 'pat'",
(fullName, sex, bday,))
    patUsername = None
    ind = 0
    for (username,) in cursor:
        ind = ind + 1
        # in case there is more than one
        # patient with the same name, sex and bday
        if ind > 1:
            patUsername = None
            break
        patUsername = username
    pconn.close()
    cursor, pconn = query(
"insert into studies_assigned(study_id, patient_username, uploaded) \
values (?, ?, NOW());",
            (studyID, patUsername if patUsername else '',))
    pconn.close()
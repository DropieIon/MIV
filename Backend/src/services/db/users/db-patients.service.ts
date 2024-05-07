import mariadb from 'mariadb';
import { sq } from "../db-functions";
import { patientApiResp } from '../../../types/users/patients.type'
import { formatName } from '../../../utils/helper.util';

export async function dbPatients(docUsername: string, type: 'assigned' | 'all')
    : Promise<string | patientApiResp[]> {
    const assigned = type === 'assigned';
    const querry_sql = assigned ? 
    "select pa.patient_username, pd.full_name, pd.birthday, pd.sex, \
    pa.patient_id, pic.profile_pic, COUNT(DISTINCT sa.study_id) studs \
    from patients_assigned pa \
    left join personal_data pd on pa.patient_username=pd.username \
    left join profile_pictures pic on pic.username = pa.patient_username \
    left join studies_assigned sa on sa.patient_username = pa.patient_username \
    join login l \
    where pa.doctor_username=? \
    and l.has_completed='Y' \
    group by pa.patient_username \
    " :
    "select l.username, d.full_name, d.birthday, d.sex, l.uuid, pic.profile_pic, COUNT(DISTINCT sa.study_id) studs \
    from login l \
    left join personal_data d on l.username = d.username \
    left join profile_pictures pic on pic.username = l.username \
    left join studies_assigned sa on sa.patient_username = l.username \
    where l.role='pat' \
    and l.has_completed='Y' \
    and l.username not in (select patient_username from patients_assigned where doctor_username = ?) \
    and l.username not in (select patient_username from requests where doctor_username = ?) \
    group by l.username";
    const querry_params = assigned ? [docUsername] : [docUsername, docUsername];
    
    let query_resp = await sq(querry_sql, querry_params);
    if (typeof query_resp !== "string" && !(query_resp instanceof mariadb.SqlError)) {
        let resp_list: patientApiResp[] = [];
        for (let i = 0; i < query_resp.length; i++)
        {
            const current_resp = query_resp[i];
            const full_name = formatName(current_resp.full_name);
            resp_list.push({
                username: assigned ? current_resp.patient_username : current_resp.username,
                full_name,
                birthday: current_resp.birthday,
                sex: current_resp.sex,
                uid: assigned ? current_resp.patient_id : current_resp.uuid,
                profile_pic: current_resp.profile_pic,
                nrOfStudies: parseInt(current_resp.studs)
            });
        }
        return resp_list;
    }
    if(query_resp instanceof mariadb.SqlError)
        return "Pat assigned error: " + query_resp.sqlMessage;
    return "Cannot get assigned patients list " + query_resp;
}
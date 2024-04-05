import mariadb from 'mariadb';
import { sq } from "../db-functions";
import { patientApiResp } from '../../../types/users/patients.type'

export async function dbPatients(docUsername: string, type: 'assigned' | 'all')
    : Promise<string | patientApiResp[]> {
    const assigned = type === 'assigned';
    const querry_sql = assigned ? 
    "select pa.patient_username, pd.full_name, pd.age, pd.sex, pa.patient_id, pic.profile_pic \
    from patients_assigned pa \
    left join personal_data pd on pa.patient_username=pd.username \
    left join profile_pictures pic on pic.username = pa.patient_username \
    where pa.doctor_username=?" :
    "select l.username, d.full_name, d.age, d.sex, l.uuid, pic.profile_pic  \
    from login l \
    left join personal_data d on l.username = d.username \
    left join profile_pictures pic on pic.username = l.username \
    where isMedic='N' \
    and l.username not in (select patient_username from patients_assigned where doctor_username = ?) \
    and l.username not in (select patient_username from requests where doctor_username = ?)";
    const querry_params = assigned ? [docUsername] : [docUsername, docUsername];
    
    let query_resp = await sq(querry_sql, querry_params);
    if (typeof query_resp !== "string" && !(query_resp instanceof mariadb.SqlError)) {
        let resp_list: patientApiResp[] = [];
        for (let i = 0; i < query_resp.length; i++)
        {
            const current_resp = query_resp[i];
            resp_list.push({
                username: assigned ? current_resp.patient_username : current_resp.username,
                full_name: current_resp.full_name,
                age: current_resp.age,
                sex: current_resp.sex,
                uid: assigned ? current_resp.patient_id : current_resp.uuid,
                profile_pic: current_resp.profile_pic
            });
        }
        return resp_list;
    }
    if(query_resp instanceof mariadb.SqlError)
        return "Pat assigned error: " + query_resp.sqlMessage;
    return "Cannot get assigned patients list " + query_resp;
}
import mariadb from 'mariadb';
import { sq } from '../db-functions';
import { pfpsItem } from '../../../../../Common/types';


export async function dbGetPfp(username: string): Promise<string | { pfp: string }> {
    const sql_resp = await sq
        ('select profile_pic from profile_pictures where username=?',
        [username]);
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        if(sql_resp.length > 0)
            return { pfp: sql_resp[0].profile_pic };
        else
            return "No pfp for user";
    }
    return "Cannot get profile picture";
}

export async function dbGetPfpsStudy(studyId: string): Promise<string | pfpsItem[]> {
    // we want the pfps of all doctors and patients that can comment on the study
    // this means that we check for the patient pfp, and then we try to link
    // the study to the doctor using the patients_assigned
    const sql_resp = await sq
        ('select username, profile_pic from profile_pictures \
        where username in \
            (select DISTINCT username_sender from messages where study_id = ?) \
            or username in \
                (select username from login \
                    where role = "med"\
                    and username in (select doctor_username from patients_assigned where \
                        patient_username in (select patient_username from studies_assigned where study_id = ?)) \
                )',
        [studyId, studyId]);
    
    if (typeof sql_resp !== "string" && !(sql_resp instanceof mariadb.SqlError)) {
        if(sql_resp.length > 0) {
            let resp_list: pfpsItem[] = [];
            for (let i = 0; i < sql_resp.length; i++) {
                const current_resp = sql_resp[i];
                resp_list.push({
                    username: current_resp.username,
                    pfp: current_resp.profile_pic
                });
            }
            return resp_list;
        }
        else
            return [];
    }
    return "Cannot get profile pictures";
}
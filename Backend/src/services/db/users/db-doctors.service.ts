import { doctorApiResp } from "../../../types/users/doctors.type";
import { sq } from "../db-functions";
import mariadb from 'mariadb';
import { formatName } from '../../../utils/helper.util';
import { MyDocsListEntry } from "../../../../../Common/types";

export async function dbAllDocs(patUsername: string) 
    : Promise<string | doctorApiResp[]> {
    const queryResp = await sq("select l.username, d.full_name, d.birthday, d.sex, l.uuid, pic.profile_pic \
    from login l \
    left join personal_data d on l.username = d.username \
    left join profile_pictures pic on pic.username = l.username \
    where role='med' \
    and l.username not in (select doctor_username from patients_assigned where patient_username = ?) \
    and l.username not in (select doctor_username from requests where patient_username = ?) ",
    [patUsername, patUsername]);
    if (typeof queryResp !== "string" && !(queryResp instanceof mariadb.SqlError)) {
        let respList: doctorApiResp[] = [];
        for (let i = 0; i < queryResp.length; i++)
        {
            const current_resp = queryResp[i];
            respList.push({
                username: current_resp.username,
                full_name: formatName(current_resp.full_name),
                birthday: current_resp.birthday,
                sex: current_resp.sex,
                uid: current_resp.uuid,
                profile_pic: current_resp.profile_pic
            });
        }
        return respList;
    }
    if(queryResp instanceof mariadb.SqlError)
        return "Pat assigned error: " + queryResp.sqlMessage;
    return "Cannot get assigned patients list " + queryResp;
}


export async function dbGetMyDocs(patUsername: string)
: Promise<string | MyDocsListEntry[]> {
    const queryResp = await sq("select pd.full_name, pd.sex, pic.profile_pic, pd.birthday, l.uuid \
        from login l \
        join personal_data pd on l.username = pd.username \
        join profile_pictures pic on pic.username = l.username \
        where l.username in (select doctor_username from patients_assigned where patient_username = ?) \
        ",
        [patUsername]);
        if (typeof queryResp !== "string" && !(queryResp instanceof mariadb.SqlError)) {
            let respList: MyDocsListEntry[] = [];
            for (let i = 0; i < queryResp.length; i++)
            {
                const current_resp = queryResp[i];
                respList.push({
                    fullName: formatName(current_resp.full_name),
                    birthday: current_resp.birthday,
                    sex: current_resp.sex,
                    pfp: current_resp.profile_pic,
                    uuid: current_resp.uuid
                });
            }
            return respList;
        }
        if(queryResp instanceof mariadb.SqlError)
            return "Pat assigned error: " + queryResp.sqlMessage;
        return "Cannot get assigned patients list " + queryResp;
}
import { doctorApiResp } from "../../../types/users/doctors.type";
import { sq } from "../db-functions";
import mariadb from 'mariadb';
import { formatName } from '../../../utils/helper.util';
import { MyDocsListEntry } from "../../../../../Common/types";
import { logger } from '../../../utils/logger';

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
        logger.info({
            message: "Got all docs",
            labels: {
                "origin": "db"
            }
        });
        return respList;
    }
    if(queryResp instanceof mariadb.SqlError) {
        logger.error({
            message: `Pat assigned error: ${queryResp.sqlMessage}`,
            labels: {
                "origin": "db"
            }
        });
        return `Pat assigned error: ${queryResp.sqlMessage}`;
    }
    logger.error({
        message: `Cannot get assigned patients list ${queryResp}`,
        labels: {
            "origin": "db"
        }
    });
    return `Cannot get assigned patients list ${queryResp}`;
}


export async function dbGetMyDocs(patUsername: string)
: Promise<string | MyDocsListEntry[]> {
    const queryResp = await sq("select pd.full_name, pd.sex, pic.profile_pic, pd.birthday, l.uuid \
        from login l \
        join personal_data pd on l.username = pd.username \
        join profile_pictures pic on pic.username = l.username \
        where l.username in (select doctor_username from patients_assigned where patient_username = ?) \
        and l.role = 'med' ",
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
            logger.info({
                message: "Got patinet's docs",
                labels: {
                    "origin": "db"
                }
            });
            return respList;
        }
        if(queryResp instanceof mariadb.SqlError) {
            logger.error({
                message: `Pat assigned error: ${queryResp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return `Pat assigned error: ${queryResp.sqlMessage}`;
        }
        logger.error({
            message: `Cannot get assigned patients list ${queryResp}`,
            labels: {
                "origin": "db"
            }
        });
        return `Cannot get assigned patients list ${queryResp}`;
}
import { patientApiResp } from "../../types/users/patients.type";
import { dbPatients } from "../db/users/db-patients.service";
import { logger } from "../../utils/logger";

type respAssignedPatients = {
    ok: boolean,
    data: string | patientApiResp[]
}

export async function svcGetAssignedPatients(username: string): Promise<respAssignedPatients> {
    const resp_db = await dbPatients(username, 'assigned', false);
    if(typeof resp_db === "string") {
        logger.error({
            message: resp_db,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: resp_db};
    }
    logger.info({
        message: "Got assigned patients successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: resp_db};
}

export async function svcGetAllPatients(username: string, admin: boolean): Promise<respAssignedPatients> {
    const resp_db = await dbPatients(username, 'all', admin);
    if(typeof resp_db === "string") {
        logger.error({
            message: resp_db,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: resp_db};
    }
    logger.info({
        message: "Got all patients successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: resp_db};
}
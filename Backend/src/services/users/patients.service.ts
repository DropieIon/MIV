import { patientApiResp } from "../../types/users/patients.type";
import { dbPatients } from "../db/users/db-patients.service";

type respAssignedPatients = {
    ok: boolean,
    data: string | patientApiResp[]
}

export async function svcGetAssignedPatients(username: string): Promise<respAssignedPatients> {
    const resp_db = await dbPatients(username, 'assigned');
    if(typeof resp_db === "string")
        return {ok: false, data: resp_db};
    return { ok: true, data: resp_db};
}

export async function svcGetAllPatients(username: string): Promise<respAssignedPatients> {
    const resp_db = await dbPatients(username, 'all');
    if(typeof resp_db === "string")
        return {ok: false, data: resp_db};
    return { ok: true, data: resp_db};
}
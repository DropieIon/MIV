import { resp_common_services } from "../../types/authentication.type";
import { db_insert_patient_requests } from '../db/db-auth.service';

export async function insert_personal_requests(username: string, to: string): Promise<resp_common_services> {
    const resp_db = await db_insert_patient_requests(username, to);
    if(typeof resp_db === "string" && resp_db !== "")
        return {ok: false, data: resp_db};
    return { ok: true, data: "Request requested"};
}
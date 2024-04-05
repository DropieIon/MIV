import { personal_requests_form } from "../../types/account_data/personal_requests.type";
import {
    db_insert_patient_requests,
    db_get_requests,
} from "../db/account_data/db-requests.service";

type resp_presonal_requests = {
    ok: boolean,
    data: personal_requests_form[] | string
}

export async function get_personal_requests(username: string, isMedic: 'Y' | 'N'): Promise<resp_presonal_requests> {
    const resp_db = await db_get_requests(username, isMedic);
    if(typeof resp_db === "string")
        return {ok: false, data: resp_db};
    return { ok: true, data: resp_db};
}
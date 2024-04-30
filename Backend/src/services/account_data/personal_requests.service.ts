import { requestsApiResp } from "../../types/account_data/requests.type";
import {
    db_get_requests,
} from "../db/account_data/db-requests.service";

type resp_presonal_requests = {
    ok: boolean,
    data: requestsApiResp[] | string
}

export async function get_personal_requests(username: string, role: string): Promise<resp_presonal_requests> {
    const resp_db = await db_get_requests(username, role);
    if(typeof resp_db === "string")
        return {ok: false, data: resp_db};
    return { ok: true, data: resp_db};
}
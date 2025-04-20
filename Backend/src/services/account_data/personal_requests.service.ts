import { requestsApiResp } from "../../types/account_data/requests.type";
import {
    db_get_requests,
} from "../db/account_data/db-requests.service";
import { logger } from "../../utils/logger";

type resp_presonal_requests = {
    ok: boolean,
    data: requestsApiResp[] | string
}

export async function get_personal_requests(username: string, role: string): Promise<resp_presonal_requests> {
    const resp_db = await db_get_requests(username, role);
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
        message: "Got personal requests successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: resp_db};
}
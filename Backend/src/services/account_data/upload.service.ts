import { resp_common_services } from "../../types/auth/authentication.type";
import { dbAllowUnlim4h } from '../db/account_data/db-upload.service'
import { logger } from "../../utils/logger";

export async function svcAllowUnlim4h(patUsername:string)
: Promise<resp_common_services> {
    const respDb = await dbAllowUnlim4h(patUsername);
    if(typeof respDb === "string" && respDb !== "") {
        logger.error({
            message: respDb,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respDb};
    }
    logger.info({
        message: 'Allowed unlim uploads to patient.',
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: 'Allowed unlim uploads to patient.'};
}
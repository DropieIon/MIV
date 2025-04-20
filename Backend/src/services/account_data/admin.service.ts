import { resp_common_services } from "../../types/auth/authentication.type";
import { dbDemotePat, dbPatIsAssigned, dbPromotePat } from "../db/account_data/db-admin.service";
import { has_completed } from "../db/auth/db-auth.service";
import { logger } from "../../utils/logger";

export async function svcPromotePat(patUsername: string): Promise<resp_common_services> {
    if((await has_completed(patUsername)) !== 'Y') {
        logger.error({
            message: "Patient should complete personal data first",
            labels: {
                "origin": "svc"
            } 
        });
        return { ok: false, data: "Patient should complete personal data first" };
    }
    if((await dbPatIsAssigned(patUsername)) !== "") {
        logger.error({
            message: "Patient is already assigned",
            labels: {
                "origin": "svc"
            }
        });
        return { ok: false, data: "Patient is already assigned" };
    }
    const respUpdate = await dbPromotePat(patUsername);
    if(respUpdate !== "") {
        logger.error({
            message: respUpdate,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respUpdate};
    }
    logger.info({
        message: "Promoted patient successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: "Promoted patient successfully" };
}

export async function svcDemotePat(docUsername: string): Promise<resp_common_services> {
    const respUpdate = await dbDemotePat(docUsername);
    if(respUpdate !== "") {
        logger.error({
            message: respUpdate,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respUpdate};
    }
    logger.info({
        message: "Demoted patient successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: "Demoted patient successfully" };
}
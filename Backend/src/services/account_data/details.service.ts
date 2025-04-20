import { resp_common_services } from "../../types/auth/authentication.type";
import { patientForm } from "../../types/auth/authentication.type";
import { dbGetDetails, dbGetPfp, dbGetPfpsStudy } from "../db/account_data/db-details.service";
import { has_completed, insert_patient_details } from "../db/auth/db-auth.service";
import { logger } from "../../utils/logger";

export async function svcPutPatient_details(username: string, details: patientForm, update: boolean)
    : Promise<resp_common_services> {
    if(!update && (await has_completed(username)) === 'Y') {
        logger.error({
            message: "Data already completed",
            labels: {
                "origin": "svc"
            }
        });
        return { ok: false, data: "Data already completed" };
    }
    const resp_insert = await insert_patient_details(username, details, update);
    if(resp_insert !== "") {
        logger.error({
            message: resp_insert,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: resp_insert};
    }
    logger.info({
        message: "Added patient data successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: "Added patient data successfully" };
}

export async function svcGetPfp(username: string) {
    const respDB = await dbGetPfp(username);
    if(typeof respDB === "string") {
        logger.error({
            message: respDB,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respDB};
    }
    logger.info({
        message: "Got pfp successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: respDB.pfp };
}

export async function svcGetDetails(username: string) {
    const respDB = await dbGetDetails(username);
    if(typeof respDB === "string") {
        logger.error({
            message: respDB,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respDB};
    }
    logger.info({
        message: "Got details successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: respDB };
}

export async function svcGetPfpsStudy(studyId: string) {
    const respDB = await dbGetPfpsStudy(studyId);
    if(typeof respDB === "string") {
        logger.error({
            message: respDB,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respDB};
    }
    logger.info({
        message: "Got study pfps successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: respDB };
}
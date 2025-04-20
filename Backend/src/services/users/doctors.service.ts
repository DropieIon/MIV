import { doctorApiResp } from "../../types/users/doctors.type";
import { dbAllDocs, dbGetMyDocs } from "../db/users/db-doctors.service";
import { MyDocsListEntry } from "../../../../Common/types";
import { logger } from "../../utils/logger";

type respAllPatients = {
    ok: boolean,
    data: string | doctorApiResp[] | MyDocsListEntry[]
};

export async function svcGetAllDoctors(patUsername: string) 
    : Promise<respAllPatients> {
    const respDb = await dbAllDocs(patUsername);
    if(typeof respDb === "string") {
        logger.error({
            message: respDb,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respDb};
    }
    logger.info({
        message: "Got all docs successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: respDb};
}

export async function svcGetMyDocs(patUsername: string) 
    : Promise<respAllPatients> {
    const respDb = await dbGetMyDocs(patUsername);
    if(typeof respDb === "string") {
        logger.error({
            message: respDb,
            labels: {
                "origin": "svc"
            }
        });
        return {ok: false, data: respDb};
    }
    logger.info({
        message: "Got my patient's docs successfully",
        labels: {
            "origin": "svc"
        }
    });
    return { ok: true, data: respDb};
}
import { resp_common_services } from "../../types/auth/authentication.type";
import { dbDemotePat, dbPatIsAssigned, dbPromotePat } from "../db/account_data/db-admin.service";
import { has_completed } from "../db/auth/db-auth.service";


export async function svcPromotePat(patUsername: string): Promise<resp_common_services> {
    if(await has_completed(patUsername) !== 'Y') {
        return { ok: false, data: "Patient should complete personal data first" };
    }
    if(await dbPatIsAssigned(patUsername) !== "") {
        return { ok: false, data: "Patient is assigned" };
    }
    const respUpdate = await dbPromotePat(patUsername);
    if(respUpdate !== "")
        return {ok: false, data: respUpdate};
    return { ok: true, data: "Promoted patient successfully" };
}

export async function svcDemotePat(docUsername: string): Promise<resp_common_services> {
    const respUpdate = await dbDemotePat(docUsername);
    if(respUpdate !== "")
        return {ok: false, data: respUpdate};
    return { ok: true, data: "Demoted patient successfully" };
}
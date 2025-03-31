import { resp_common_services } from "../../types/auth/authentication.type";
import { dbAllowUnlim4h } from '../db/account_data/db-upload.service'

export async function svcAllowUnlim4h(patUsername:string)
: Promise<resp_common_services> {
    const respDb = await dbAllowUnlim4h(patUsername);
    if(typeof respDb === "string" && respDb !== "")
        return {ok: false, data: respDb};
    return { ok: true, data: 'Allowed unlim uploads to patient.'};
}
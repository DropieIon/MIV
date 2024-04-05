import { resp_common_services } from "../../types/auth/authentication.type";
import { patientForm } from "../../types/auth/authentication.type";
import { has_completed, insert_patient_details } from "../db/auth/db-auth.service";


export async function patient_details(username: string, details: patientForm): Promise<resp_common_services> {
    if(await has_completed(username) === 'Y') {
        return { ok: false, data: "Data already completed" };
    }
    const resp_insert = await insert_patient_details(username, details);
    if(resp_insert !== "")
        return {ok: false, data: resp_insert};
    return { ok: true, data: "Added patient data successfully" };
}
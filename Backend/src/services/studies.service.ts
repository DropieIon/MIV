import { resp_common_services, resp_list_services } from "../types/authentication.type";
import { list_studies } from "./db-permissions.service";

export async function getStudies(patient_username: string): Promise<resp_list_services> {
    let resp_studies = await list_studies(patient_username);
    if (typeof resp_studies !== "string") {
        // is list
        return {ok: true, data: resp_studies};   
    }
    return {ok: false, data: resp_studies};
}
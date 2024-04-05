import { resp_common_services } from "../../types/auth/authentication.type";
import { db_ans_request, db_insert_patient_requests } from '../db/account_data/db-requests.service';

export async function insert_personal_requests(username: string, to: string): 
    Promise<resp_common_services>
{
    const resp_db = await db_insert_patient_requests(username, to);
    if(typeof resp_db === "string" && resp_db !== "")
        return {ok: false, data: resp_db};
    return { ok: true, data: "Request requested"};
}

export async function svc_ans_req(acc: boolean, doc_username: string, pat_username: string): 
    Promise<resp_common_services> 
{
    const resp_db = await db_ans_request(acc, doc_username, pat_username);
    if(typeof resp_db === "string" && resp_db !== "")
        return {ok: false, data: resp_db};
    return { ok: true, data: `Request ${acc ? 'accepted' : 'declined'}`};
}
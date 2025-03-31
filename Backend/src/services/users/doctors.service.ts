import { doctorApiResp } from "../../types/users/doctors.type";
import { dbAllDocs, dbGetMyDocs } from "../db/users/db-doctors.service";
import { MyDocsListEntry } from "../../../../Common/types";

type respAllPatients = {
    ok: boolean,
    data: string | doctorApiResp[] | MyDocsListEntry[]
};

export async function svcGetAllDoctors(patUsername: string) 
    : Promise<respAllPatients> {
    const respDb = await dbAllDocs(patUsername);
    if(typeof respDb === "string")
        return {ok: false, data: respDb};
    return { ok: true, data: respDb};
}

export async function svcGetMyDocs(patUsername: string) 
    : Promise<respAllPatients> {
    const respDb = await dbGetMyDocs(patUsername);
    if(typeof respDb === "string")
        return {ok: false, data: respDb};
    return { ok: true, data: respDb};
}
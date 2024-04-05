import { doctorApiResp } from "../../types/users/doctors.type";
import { dbAllDocs } from "../db/users/db-doctors.service";

type respAllPatients = {
    ok: boolean,
    data: string | doctorApiResp[]
};

export async function svcGetAllDoctors(patUsername: string) 
    : Promise<respAllPatients> {
    const respDb = await dbAllDocs(patUsername);
    if(typeof respDb === "string")
        return {ok: false, data: respDb};
    return { ok: true, data: respDb};
}
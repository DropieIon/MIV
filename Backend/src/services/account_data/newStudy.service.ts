import { resp_common_services } from "../../types/auth/authentication.type";
import { dbAssignStudy } from "../db/account_data/db-new-study.service";

export async function svcAssignStudy(studyID: string, patUsername: string)
    : Promise<resp_common_services> {
    const respDB = await dbAssignStudy(studyID, patUsername);
    if(respDB !== "") {
        console.error(respDB);
        return {
            ok: false,
            data: respDB
        };
    }
    return {
        ok: true,
        data: "Study assigned."
    };
}
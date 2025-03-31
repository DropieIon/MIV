import { resp_common_services } from "../../types/auth/authentication.type";
import { dbAssignStudy, dbDeleteStudy, dbUnssignStudy } from "../db/account_data/db-studies.service";

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

export async function svcUnassignStudy(studyID: string, patUsername: string | null)
    : Promise<resp_common_services> {
    const respDB = await dbUnssignStudy(studyID, patUsername);
    if(respDB !== "") {
        return {
            ok: false,
            data: respDB
        };
    }
    return {
        ok: true,
        data: "Study unassigned."
    };
}

export async function svcDeleteStudy(token: string, studyID: string)
    : Promise<resp_common_services> {
    const respDB = await dbDeleteStudy(token, studyID);
    if(respDB !== "") {
        return {
            ok: false,
            data: respDB
        };
    }
    return {
        ok: true,
        data: "Study deleted."
    };
}
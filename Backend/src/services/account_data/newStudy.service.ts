import { UploadedFile } from "express-fileupload";
import { resp_common_services } from "../../types/auth/authentication.type";
import { dbNewStudy } from "../db/account_data/db-new-study.service";
import { parseDicom } from 'dicom-parser';

export async function svcNewStudy(patUsername: string, dicomFile: UploadedFile | UploadedFile[])
    : Promise<resp_common_services> {
    let studyID: string;
    if (Array.isArray(dicomFile)) {
        studyID = "";
    }
    else {
        const StudyInstanceUID = parseDicom(dicomFile.data).string('x0020000d');
        try {
            const rez = await fetch('http://orthanc:8042/instances',
                {
                    method: 'POST',
                    body: dicomFile.data
                });
            // We are searching the studyID based on it's StudyInstanceUID
            // you'll have to trust me on this one
            studyID = (await (await fetch('http://orthanc:8042/tools/find', {
                method: 'POST',
                body: `{"Level" : "Study", "Expand":true, "Query" : {"StudyInstanceUID" : "${StudyInstanceUID}"} }`
            })).json())[0].ID;
        }
        catch (err) {
            console.error(err);
            return { ok: false, data: err };
        }
    }
        

        const respDb = await dbNewStudy(patUsername, studyID);
        if (typeof respDb === "string" && respDb !== "")
            return { ok: false, data: respDb };
        return { ok: true, data: 'Patient unassigned' };
    }
import { lstatSync, readFileSync, readdirSync } from "fs";
import { readdir } from "fs/promises";
import { extname } from "path";
import dcmDimse from 'dcmjs-dimse';
import { parseDicom } from "dicom-parser";
import { dbCheckStudyID, dbNewStudy } from "../../db/account_data/db-new-study.service";

const { Client } = dcmDimse;
const { CStoreRequest } = dcmDimse.requests;

function getExtension(filename: string) {
    var ext = extname(filename||'').split('.');
    return ext[ext.length - 1].toLowerCase();
}

function assignStudyID(dicomPath: string, prevSUID: string, patUsername: string): string {
    const dmcData = readFileSync(dicomPath);
    const StudyInstanceUID = parseDicom(dmcData).string('x0020000d');
    // caching the response
    if(StudyInstanceUID && prevSUID === StudyInstanceUID)
        return StudyInstanceUID;
    fetch('http://orthanc:8042/instances', {
        method: 'POST',
        body: dmcData
    })
        .then(() => {
            fetch('http://orthanc:8042/tools/find', {
                method: 'POST',
                body: `{"Level" : "Study", "Expand":true, "Query" : {"StudyInstanceUID" : "${StudyInstanceUID}"} }`
            }).
                then(async (data) => {
                    const resp: any = await data.json();
                    const studyID = resp[0].ID;
                    if(await dbCheckStudyID(patUsername, studyID))
                        dbNewStudy(patUsername, studyID);
                })
                .catch((err) => {
                    console.log(err);

                });

        })
        .catch((err) => {
            console.log(err);

        });
    if(StudyInstanceUID)
        return StudyInstanceUID;
    return '';
}

function sendToOrthanc(filePath: string) {
    try {
        const client = new Client();
        const request = new CStoreRequest(filePath);
        client.addRequest(request);
        client.send('orthanc', 4242, 'SCU', 'ANY-SCP', {
            logCommandDatasets: false,
            logDatasets: false
        });
        console.log("Ended");
        
    } catch (error) {
        console.error("Uploading file to orthanc err:", error);
    }
}

export async function parseDICOMFolder(path: string, patUsername: string) {
    try {
        let dirList: string[] = [path];
        let prevSUID = '';
        let dir: string | undefined;
        while (1) {
            dir = dirList.pop();
            console.log(dir);
            
            if(!dir)
                // end of list
                break;
            const dirContent = readdirSync(dir);
            for (const entry of dirContent) {
                const currentPath = dir + '/' + entry;
                if (lstatSync(currentPath).isFile()) {
                    // it's a file
                    if (getExtension(currentPath) === 'dcm') {
                        // it's a dicom file
                        sendToOrthanc(currentPath);
                        prevSUID = assignStudyID(currentPath, prevSUID, patUsername);
                    }
                }
                else {
                    // it's a directory
                    dirList.push(currentPath);
                }
            }
        }
    } catch (error) {
        console.log(error);
        
    }
    
}
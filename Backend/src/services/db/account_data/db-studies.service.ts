import { sq } from "../db-functions";
import mariadb from 'mariadb';
import { logger } from "../../../utils/logger";

export async function dbNewStudy(patUsername: string, studyId: string): Promise<string> {
    const query_resp = await sq(
        'insert into studies_assigned(patient_username, study_id, uploaded) values (?, ?, NOW())',
        [patUsername, studyId]);
    if (query_resp !== "") {
        if (query_resp instanceof mariadb.SqlError) {
            if (query_resp.code === "ER_DUP_ENTRY") {
                logger.error({
                    message: "Study id already assigned",
                    labels: {
                        "origin": "db"
                    }
                });
                return "Study id already assigned";
            }
            logger.error({
                message: `Database insertion error ${query_resp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return "Database insertion error " + query_resp.sqlMessage;
        }
    }
    logger.info({
        message: "Study inserted",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function dbCheckStudyID(patUsername: string, studyId: string): Promise<string | boolean> {
    const queryResp = await sq(
        'select patient_username from studies_assigned \
        where patient_username = ? \
        and study_id = ?',
        [patUsername, studyId]);
        if (typeof queryResp !== "string" && !(queryResp instanceof mariadb.SqlError)) {
            // it's the resp list
            if(queryResp.length === 0) {
                logger.info({
                    message: "Study not assigned. Can continue",
                    labels: {
                        "origin": "db"
                    }
                });
                return true;
            }
            logger.error({
                message: "Study already assigned",
                labels: {
                    "origin": "db"
                }
            });
            return false;
        }
        logger.error({
            message: "Cannot get studies list",
            labels: {
                "origin": "db"
            }
        });
        return "Cannot get studies list";
}

export async function dbAssignStudy(studyID: string, patUsername: string): Promise<string> {
    const queryResp = await sq(
        'update studies_assigned set patient_username = ?, uploaded = uploaded where study_id = ?',
        [patUsername, studyID]);
    if (queryResp !== "") {
        if (queryResp instanceof mariadb.SqlError) {
            logger.error({
                message: `Database update error ${queryResp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return "Database update error " + queryResp.sqlMessage;
        }
    }
    logger.info({
        message: "Study assigned",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function dbUnssignStudy(studyID: string, patUsername: string | null): Promise<string> {
    // patUsername is null if it's a medic
    const med = patUsername === null;
    const query = 'update studies_assigned set patient_username = "", uploaded = uploaded where study_id = ?' + 
        (med ? '' : ' and patient_username = ?');
    const queryParams = med ? [studyID] : [studyID, patUsername];
    const queryResp = await sq(
        query,
        queryParams
    );
    if (queryResp !== "") {
        if (queryResp instanceof mariadb.SqlError) {
            logger.error({
                message: `Database update error ${queryResp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return `Database update error ${queryResp.sqlMessage}`;
        }
    }
    logger.info({
        message: "Study unassigned",
        labels: {
            "origin": "db"
        }
    });
    return "";
}

export async function dbDeleteStudy(token: string, studyID: string): Promise<string> {
    const queryResp = await sq(
        'delete from studies_assigned where study_id = ?',
        [studyID]);
    if (queryResp !== "") {
        if (queryResp instanceof mariadb.SqlError) {
            logger.error({
                message: `Database deletion error ${queryResp.sqlMessage}`,
                labels: {
                    "origin": "db"
                }
            });
            return `Database deletion error ${queryResp.sqlMessage}`;
        }
    }
    try {
        const orthResp = await fetch(`http://orthanc:8042/studies/${studyID}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }, 
        });
        if (!orthResp.ok) {
            logger.error({
                message: `Orthanc deletion error ${orthResp.statusText}`,
                labels: {
                    "origin": "db"
                }
            });
            return `Orthanc deletion error ${orthResp.statusText}`;
        }
        logger.info({
            message: "Study deleted",
            labels: {
                "origin": "db"
            }
        });
        return "";
    } catch (err) {
        logger.error({
            message: `Cannot delete study: ${err}`,
            labels: {
                "origin": "db"
            }
        });
        return `Cannot delete study: ${err}`;
    }
}
import { Request, Response, NextFunction } from "express";
import RegisterError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import type { assignStudyForm } from '../../types/account_data/studies.type';
import { svcAssignStudy, svcDeleteStudy, svcUnassignStudy } from "../../services/account_data/studies.service";
import { parseJwt } from "../../utils/helper.util";
import ControllerError from "../../errors/RegisterError.error";

export async function conAssignStudy(req: Request<{}, {}, assignStudyForm>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if (!req.body.study_id || !req.body.patient_username) {
        next(new EmptyField({ message: "Study_id and patient_username are required!", logging: true }))
        return;
    }
    if (parseJwt(token)?.role === "pat") {
        next(new ControllerError({
            message: "Only a medic can assign a study!",
            code: 400
        }));
        return;
    }
    const {
        patient_username, study_id
    } = req.body;
    const resp_insert = await svcAssignStudy(study_id, patient_username);
    if (resp_insert.ok) {
        res.json({ message: resp_insert.data });
        return;
    }
    console.error(resp_insert.data);
    next(new RegisterError({
        message: resp_insert.data,
        code: 400
    }))
}

export async function conUnassignStudy(req: Request<{}, {}, { study_id: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    const jwtBody = parseJwt(token);
    const role = jwtBody?.role;
    if (!req.body.study_id) {
        next(new EmptyField({ message: "Study_id is required!", logging: true }))
        return;
    }
    
    if (!["pat", "med"].includes(parseJwt(token)?.role)) {
        next(new ControllerError({
            message: "Only a medic or a patient can unassign a study!",
            code: 400
        }));
        return;
    }
    // it only reaches this point if it's a med or pat
    let patient_username = role === "med" ? null : jwtBody?.username;
    const resp_insert = await svcUnassignStudy(req.body.study_id, patient_username);
    if (resp_insert.ok) {
        res.json({ message: resp_insert.data });
        return;
    }
    next(new RegisterError({
        message: resp_insert.data,
        code: 400
    }))
}

export async function conDeleteStudy(req: Request<{}, {}, assignStudyForm>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if (parseJwt(token)?.role !== "med") {
        next(new ControllerError({
            message: "Only a medic can delete a study!",
            code: 400
        }));
        return;
    }
    if (!req.body.study_id) {
        next(new EmptyField({ message: "Study_id is required!", logging: true }))
        return;
    }
    const {
        study_id
    } = req.body;
    const resp_insert = await svcDeleteStudy(token, study_id);
    if (resp_insert.ok) {
        res.json({ message: resp_insert.data });
        return;
    }
    next(new RegisterError({
        message: resp_insert.data,
        code: 400
    }))
}
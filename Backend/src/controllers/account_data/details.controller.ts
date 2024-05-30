import { Request, Response, NextFunction } from "express";
import RegisterError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import { patientForm } from "../../types/auth/authentication.type";
import { has_completed } from "../../services/db/auth/db-auth.service";
import { parseJwt } from "../../utils/helper.util";
import { svcPutPatient_details, svcGetDetails, svcGetPfp, svcGetPfpsStudy } from "../../services/account_data/details.service";
import ControllerError from "../../errors/RegisterError.error";

const get_username = (token: string): string => parseJwt(token)?.username;

export async function conGetDetailsController(req: Request<{}, {}, {}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    const resp_db = await svcGetDetails(get_username(token));
    if (resp_db.ok) {
        res.json(resp_db.data);
        return;
    }
    console.error(resp_db.data);
    next(new ControllerError({
        message: (resp_db.data as string),
        code: 400
    }))
}

export async function conPostDetailsController(req: Request<{}, {}, patientForm>,
    res: Response, next: NextFunction) {
    if (!req.body.birthday || !req.body.sex.length || !req.body.fullName || !req.body.profile_picB64) {
        next(new EmptyField({ message: "FullName, birthday, sex and pfp are required!", logging: true }))
        return;
    }
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    
    const resp_insert = await svcPutPatient_details(get_username(token), req.body, false);
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

export async function conUpdateDetailsController(req: Request<{}, {}, patientForm>,
    res: Response, next: NextFunction) {
    if (!req.body.birthday || !req.body.sex.length || !req.body.fullName || !req.body.profile_picB64) {
        next(new EmptyField({ message: "FullName, birthday, sex and pfp are required!", logging: true }))
        return;
    }
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    
    const resp_insert = await svcPutPatient_details(get_username(token), req.body, true);
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

export async function has_completedController(req: Request,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    
    let resp_completed = await has_completed(get_username(token));
    if(["Y", "N"].includes(resp_completed)) {
        res.json({message: resp_completed})
        return;
    }

    next(new RegisterError({
        message: resp_completed,
        code: 400
    }))
}

export async function conGetPfp(req: Request<{}, {}, { username: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(!req.body.username) {
        next(new EmptyField({
            message: "Username required",
            code: 400
        }));
        return;
    }
    let respPFP = await svcGetPfp(req.body.username);
    if (respPFP.ok) {
        res.json(respPFP.data);
        return;
    }
    next(new ControllerError({
        message: respPFP.data,
        code: 400
    }))
}

export async function conGetPfpsStudy(req: Request<{}, {}, { study_id: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(!req.body.study_id) {
        next(new EmptyField({
            message: "Study_id is required",
            code: 400
        }));
        return;
    }
    let respPFP = await svcGetPfpsStudy(req.body.study_id);
    if (respPFP.ok) {
        res.json(respPFP.data);
        return;
    }
    // it will always be a string when respPFP.ok is false
    console.log(respPFP.data);
    
    next(new ControllerError({
        message: (respPFP.data as string),
        code: 400
    }))
}

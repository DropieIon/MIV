import { Request, Response, NextFunction } from "express";
import EmptyField from "../../errors/EmptyField.error";
import { get_username, parseJwt } from "../../utils/helper.util";
import { insert_personal_requests, svcUnassignPat, svc_ans_req } from "../../services/account_data/request.service";
import ControllerError from "../../errors/RegisterError.error";

export async function pat_make_request(req: Request<{}, {}, {to: string}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(parseJwt(token)?.role === 'med'){
        next(new ControllerError({
            message: "Only a patient can request a medic.",
            code: 400
        }));
        return;
    }
    if(!req.body.to)
    {
        next(new EmptyField({message: "Doctor username is required!", logging: true}))
        return;
    }
    const resp_db = await insert_personal_requests(get_username(token), req.body.to);
    if(resp_db.ok)
    {
        res.json(resp_db.data);
        return;
    }
    next(new ControllerError({
        message: resp_db.data as string,
        code: 400
    }))
}

export async function ans_request(req: Request<{}, {}, { patient_username: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    const split_path = req.originalUrl.split("/")[2];
    const accepted = split_path === 'accept' || split_path === 'assign';
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(parseJwt(token)?.role !== 'med'){
        next(new ControllerError({
            message: "Only a doctor can answer a request.",
            code: 400
        }));
        return;
    }
    if(!req.body.patient_username)
    {
        next(new EmptyField({message: "Patient username is required!", logging: true}))
        return;
    }
    const resp_db = await svc_ans_req(accepted, get_username(token), req.body.patient_username);
    if(resp_db.ok)
    {
        res.json(resp_db.data);
        return;
    }
    next(new ControllerError({
        message: resp_db.data as string,
        code: 400
    }))
}

export async function conUnassignPat(req: Request<{}, {}, { patient_username: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(parseJwt(token)?.role === 'pat'){
        next(new ControllerError({
            message: "Only a doctor can unassign a patient.",
            code: 400
        }));
        return;
    }
    if(!req.body.patient_username)
    {
        next(new EmptyField({message: "Patient username is required!", logging: true}))
        return;
    }
    const resp_db = await svcUnassignPat(req.body.patient_username);
    if(resp_db.ok)
    {
        res.json(resp_db.data);
        return;
    }
    next(new ControllerError({
        message: resp_db.data as string,
        code: 400
    }))
}

export async function conCancelRequest(req: Request<{}, {}, { doctor_username: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(parseJwt(token)?.role === 'med'){
        next(new ControllerError({
            message: "Only a patient can cancel a request.",
            code: 400
        }));
        return;
    }
    if(!req.body.doctor_username)
    {
        next(new EmptyField({message: "Doctor username is required!", logging: true}))
        return;
    }
    const resp_db = await svc_ans_req(false, req.body.doctor_username, get_username(token));
    if(resp_db.ok)
    {
        res.json(resp_db.data);
        return;
    }
    next(new ControllerError({
        message: resp_db.data as string,
        code: 400
    }))
}
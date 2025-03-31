import { Request, Response, NextFunction } from "express";
import EmptyField from "../../errors/EmptyField.error";
import { get_username, parseJwt } from "../../utils/helper.util";
import ControllerError from "../../errors/RegisterError.error";
import { svcGetAllPatients, svcGetAssignedPatients } from "../../services/users/patients.service";

export async function conPatAssigned(req: Request<{}, {}, {}>,
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
            message: "Only a doctor can view his assigned patients.",
            code: 400
        }));
        return;
    }
    const respSvc = await svcGetAssignedPatients(get_username(token));
    if(respSvc.ok)
    {
        res.json(respSvc.data);
        return;
    }
    next(new ControllerError({
        message: respSvc.data as string,
        code: 400
    }))
}

export async function conPatAll(req: Request<{}, {}, {}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    const respSvc = await svcGetAllPatients(get_username(token), parseJwt(token)?.role === "admin");
    if(respSvc.ok)
    {
        res.json(respSvc.data);
        return;
    }
    next(new ControllerError({
        message: respSvc.data as string,
        code: 400
    }))
}
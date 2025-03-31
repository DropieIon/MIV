import { Request, Response, NextFunction } from "express";
import RegisterError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import { parseJwt } from "../../utils/helper.util";
import { svcDemotePat, svcPromotePat } from "../../services/account_data/admin.service";

export async function conPromotePat(req: Request<{}, {}, { patient_username: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(parseJwt(token)?.role !== "admin") {
        next(new RegisterError({
            message: "Only an admin can make this request",
            code: 400
        }));
        return;
    }
    if (!req.body.patient_username) {
        next(new EmptyField({ message: "Patient_username is required!", logging: true }))
        return;
    }
    
    const respUpdate = await svcPromotePat(req.body.patient_username);
    if (respUpdate.ok) {
        res.json({ message: respUpdate.data });
        return;
    }
    next(new RegisterError({
        message: respUpdate.data,
        code: 400
    }))
}

export async function conDemotePat(req: Request<{}, {}, { doc_username: string }>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if(parseJwt(token)?.role !== "admin") {
        next(new RegisterError({
            message: "Only an admin can make this request",
            code: 400
        }));
        return;
    }
    if (!req.body.doc_username) {
        next(new EmptyField({ message: "Doc_username is required!", logging: true }))
        return;
    }
    
    const respUpdate = await svcDemotePat(req.body.doc_username);
    if (respUpdate.ok) {
        res.json({ message: respUpdate.data });
        return;
    }
    next(new RegisterError({
        message: respUpdate.data,
        code: 400
    }))
}
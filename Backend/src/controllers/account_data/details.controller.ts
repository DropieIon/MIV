import { Request, Response, NextFunction } from "express";
import RegisterError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import { patientForm } from "../../types/auth/authentication.type";
import { has_completed } from "../../services/db/auth/db-auth.service";
import { parseJwt } from "../../utils/helper.util";
import { patient_details } from "../../services/account_data/details.service";

const get_username = (token: string): string => parseJwt(token)?.username;

export async function conDetailsController(req: Request<{}, {}, patientForm>,
    res: Response, next: NextFunction) {
    if (req.body.age === 0 || req.body.sex.length === 0 || req.body.fullName === "") {
        next(new EmptyField({ message: "FullName, age and sex are required!", logging: true }))
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
    
    const resp_insert = await patient_details(get_username(token), req.body);
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
import { Request, Response, NextFunction } from "express";
import RegisterError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import { patientForm } from "../../types/auth/authentication.type";
import { patient_details } from "../../services/account_data/details.service";
import { parseJwt } from "../../utils/helper.util";

const get_username = (token: string): string => parseJwt(token)?.username;

type uploadStudyForm = {
    studyID: string,
    patUsername?: string
}

//TODO: finish this function

export async function conUploadController(req: Request<{}, {}, patientForm>,
    res: Response, next: NextFunction) {
        const token = req.headers["authorization"]?.split(" ")[1];
        if(!token) {
            next(new EmptyField({
                message: "Token required",
                code: 400
            }));
            return;
        }
        // if (req.body.age === 0 || req.body.sex.length === 0 || req.body.fullName === "") {
        //     next(new EmptyField({ message: "FullName, age and sex are required!", logging: true }))
        //     return;
        // }
        if(parseJwt(token)?.isMedic === 'Y') {

        }
    const resp_insert = await patient_details(get_username(token), req.body);
    if(resp_insert.ok)
    {
        res.json({message: resp_insert.data});
        return;
    }
    next(new RegisterError({
        message: resp_insert.data,
        code: 400
    }))
}
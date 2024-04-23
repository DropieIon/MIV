import { Request, Response, NextFunction } from "express";
import RegisterError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import { parseJwt } from "../../utils/helper.util";
import ControllerError from "../../errors/RegisterError.error";
import { svcAllowUnlim4h } from "../../services/account_data/upload.service";

type allowUnlim4hForm = {
    patient_username: string
}

export async function conAllowUnlim4h(req: Request<{}, {}, allowUnlim4hForm>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    if (parseJwt(token)?.isMedic === 'N') {
        next(new ControllerError({
            message: "Not a medic",
            code: 400
        }));
        return;
    }
    if (!req.body.patient_username) {
        next(new EmptyField({
            message: "Patient username required",
            code: 400
        }));
        return;
    }
    const resp_insert = await svcAllowUnlim4h(req.body.patient_username);
    if (resp_insert.ok) {
        res.json({ message: resp_insert.data });
        return;
    }
    next(new RegisterError({
        message: resp_insert.data,
        code: 400
    }))
}
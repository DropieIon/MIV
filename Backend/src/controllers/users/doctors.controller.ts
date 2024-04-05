import { Request, Response, NextFunction } from "express";
import EmptyField from "../../errors/EmptyField.error";
import { get_username, parseJwt } from "../../utils/helper.util";
import ControllerError from "../../errors/RegisterError.error";
import { svcGetAllDoctors } from "../../services/users/doctors.service";

export async function conDocAll(req: Request<{}, {}, {}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    };
    if (parseJwt(token)?.isMedic === 'Y') {
        next(new ControllerError({
            message: "Only a patient can view all docs.",
            code: 400
        }));
        return;
    }
    const respSvc = await svcGetAllDoctors(get_username(token));
    if (respSvc.ok) {
        res.json(respSvc.data);
        return;
    }
    next(new ControllerError({
        message: respSvc.data as string,
        code: 400
    }))
}
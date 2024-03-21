import { Request, Response, NextFunction } from "express";
import RegisterError from "../errors/RegisterError.error";
import EmptyField from "../errors/EmptyField.error";
import { get_username, parseJwt } from "../utils/helper.util";
import { personal_requests_form } from "../types/personal_requests.type";
import { get_personal_requests } from "../services/requests/personal_requests.service";

export async function get_personal_requestsController(req: Request<{}, {}, {}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    const resp_db = await get_personal_requests(get_username(token), parseJwt(token)?.isMedic);
    if(resp_db.ok)
    {
        res.json(resp_db.data);
        return;
    }
    next(new RegisterError({
        message: resp_db.data as string,
        code: 400
    }))
}

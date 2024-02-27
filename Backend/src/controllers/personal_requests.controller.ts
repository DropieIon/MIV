import { Request, Response, NextFunction } from "express";
import RegisterError from "../errors/RegisterError.error";
import EmptyField from "../errors/EmptyField.error";
import { get_username, parseJwt } from "../utils/helper.util";
import { personal_requests_form } from "../types/personal_requests.type";
import { insert_personal_requests, get_personal_requests } from "../services/requests/personal_requests.service";

export async function post_personal_requestsController(req: Request<{}, {}, personal_requests_form>,
    res: Response, next: NextFunction) {
    if (!req.body.to) {
        next(new EmptyField({ message: "To is required!", logging: true }))
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
    const resp_db = await insert_personal_requests(get_username(token), req.body.to);
    if(resp_db.ok)
    {
        res.json({message: resp_db.data});
        return;
    }
    next(new RegisterError({
        message: resp_db.data as string,
        code: 400
    }))
}

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

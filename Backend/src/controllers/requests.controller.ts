import { Request, Response, NextFunction } from "express";
import RegisterError from "../errors/RegisterError.error";
import EmptyField from "../errors/EmptyField.error";
import { get_username, parseJwt } from "../utils/helper.util";
import { insert_personal_requests, get_personal_requests } from "../services/requests/personal_requests.service";
import { db_insert_patient_requests } from "../services/db/db-auth.service";

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
    // const resp_db = await db_insert_patient_requests(get_username(token), req.body.to);
    // if(resp_db.ok)
    // {
    //     res.json(resp_db.data);
    //     return;
    // }
    // next(new RegisterError({
    //     message: resp_db.data as string,
    //     code: 400
    // }))
}
import { Request, Response, NextFunction } from "express";
import EmptyField from "../../errors/EmptyField.error";
import { get_username, parseJwt } from "../../utils/helper.util";
import { get_personal_requests } from "../../services/account_data/personal_requests.service";
import ControllerError from "../../errors/RegisterError.error";
import { logger } from "../../utils/logger";

export async function get_personal_requestsController(req: Request<{}, {}, {}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) {
        logger.warn({
            message: "Token required",
            labels: {
                "origin": "controller"
            }
        });
        next(new EmptyField({
            message: "Token required",
            code: 400
        }));
        return;
    }
    const resp_db = await get_personal_requests(get_username(token), parseJwt(token)?.role);
    if(resp_db.ok)
    {
        res.json(resp_db.data);
        return;
    }
    logger.error({
        message: resp_db.data,
        labels: {
            "origin": "db"
        }
    });
    next(new ControllerError({
        message: resp_db.data as string,
        code: 400
    }))
}

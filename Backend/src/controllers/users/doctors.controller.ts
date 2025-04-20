import { Request, Response, NextFunction } from "express";
import EmptyField from "../../errors/EmptyField.error";
import { get_username, parseJwt } from "../../utils/helper.util";
import ControllerError from "../../errors/RegisterError.error";
import { svcGetAllDoctors, svcGetMyDocs } from "../../services/users/doctors.service";
import { logger } from "../../utils/logger";

export async function conDocAll(req: Request<{}, {}, {}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        logger.error({
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
    };
    if (parseJwt(token)?.role === 'med') {
        logger.error({
            message: "Only a patient can view all docs.",
            labels: {
                "origin": "controller"
            }
        });
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
    logger.error({
        message: respSvc.data,
        labels: {
            "origin": "db"
        }
    });
    next(new ControllerError({
        message: respSvc.data as string,
        code: 400
    }))
}

export async function conMyDocs(req: Request<{}, {}, {}>,
    res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        logger.error({
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
    };
    if (parseJwt(token)?.role === 'med') {
        logger.error({
            message: "Only a patient can view his doctors.",
            labels: {
                "origin": "controller"
            }
        });
        next(new ControllerError({
            message: "Only a patient can view his doctors.",
            code: 400
        }));
        return;
    }
    const respSvc = await svcGetMyDocs(get_username(token));
    if (respSvc.ok) {
        res.json(respSvc.data);
        return;
    }
    logger.error({
        message: respSvc.data,
        labels: {
            "origin": "db"
        }
    });
    next(new ControllerError({
        message: respSvc.data as string,
        code: 400
    }))
}
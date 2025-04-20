import { Request, Response, NextFunction } from "express";
import ControllerError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import type { loginForm, resp_common_services } from "../../types/auth/authentication.type";
import { loginUser } from "../../services/auth/login.service";
import { logger } from '../../utils/logger';

export async function loginController(req: Request<{}, {}, loginForm>,
    res: Response, next: NextFunction) {
    if (!req.body.username || !req.body.password) {
        logger.error({
            message: "Username and password are required!",
            labels: {
                "origin": "controller"
            }
        });
        next(new EmptyField({ message: "Username and password are required!", logging: true }))
        return;
    }
    try {
        const resp_login = await loginUser(req.body);
        if (resp_login.ok) {
            res.json(resp_login.data);
            return;
        }
        logger.error({
            message: (resp_login as resp_common_services).data,
            labels: {
                "origin": "controller"
            }
        });
        next(new ControllerError({
            // Only enters here if ok is set to false
            message: (resp_login as resp_common_services).data,
            code: 400
        }))
    } catch (error) {
        logger.error({
            message: "Login error " + error,
            labels: {
                "origin": "controller"
            }
        });
        next(new ControllerError({
            message: "Login error " + error,
            code: 400
        }));
    }
}
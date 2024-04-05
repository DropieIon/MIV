import { Request, Response, NextFunction } from "express";
import ControllerError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import type { loginForm, resp_common_services } from "../../types/auth/authentication.type";
import { loginUser } from "../../services/auth/login.service";

export async function loginController(req: Request<{}, {}, loginForm>,
    res: Response, next: NextFunction) {
    if (!req.body.username || !req.body.password) {
        next(new EmptyField({ message: "Username and password are required!", logging: true }))
        return;
    }
    let resp_login = await loginUser(req.body);
    if(resp_login.ok)
    {
        res.json(resp_login.data);
        return;
    }
    next(new ControllerError({
        // Only enters here if ok is set to false
        message: (resp_login as resp_common_services).data,
        code: 400
    }))
}
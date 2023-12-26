import { Request, Response, NextFunction } from "express";
import ControllerError from "../errors/RegisterError.error";
import EmptyField from "../errors/EmptyField.error";
import type { loginForm } from "../types/authentication.type";
import { loginUser } from "../services/login.service";

export async function loginController(req: Request<{}, {}, loginForm>,
    res: Response, next: NextFunction) {
    if (!req.body.username || !req.body.password) {
        next(new EmptyField({ message: "Username and password are required!", logging: true }))
        return;
    }
    let resp_login = await loginUser(req.body);
    if(resp_login.ok)
    {
        res.json({token: resp_login.data});
        return;
    }
    next(new ControllerError({
        message: resp_login.data,
        code: 400
    }))
}
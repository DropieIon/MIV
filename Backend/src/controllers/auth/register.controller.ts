import { Request, Response, NextFunction } from "express";
import { create_user } from '../../services/auth/register.service';
import RegisterError from "../../errors/RegisterError.error";
import EmptyField from "../../errors/EmptyField.error";
import { validateUUID } from "../../services/db/auth/db-auth.service";
import type { registerForm } from "../../types/auth/authentication.type";
import { logger } from '../../utils/logger'

export async function registerController(req: Request<{}, {}, registerForm>, 
    res: Response, next: NextFunction) {
    if(!req.body.username || !req.body.password || !req.body.email)
    {
        logger.error({
            message: "Username, password and email are required!",
            labels: {
                "origin": "controller"
            }
        });
        next(new EmptyField({message: "Username, password and email are required!", logging: true}))
        return;
    }
    let resp_create = await create_user(req.body);
    if(resp_create.ok)
        res.status(201).json({ message: resp_create.data });
    else {
        logger.error({
            message: resp_create.data,
            labels: {
                "origin": "controller"
            }
        });
        next(new RegisterError({ message: resp_create.data }));
    }
}

export async function registerUUID(req: Request, 
    res: Response, next: NextFunction) {
    let resp_validate = await validateUUID(req.params.uuid);
    if(resp_validate === ""){
        res.status(202).send('<center style="margin: \"auto\"">Email validated! Olé!</center>')
    }
    else {
        logger.error({
            message: resp_validate,
            labels: {
                "origin": "controller"
            }
        });
        next(new RegisterError({
            message: "Cannot validate uuid"
        }))
    }
}
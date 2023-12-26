import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { jwt_payload, yayOrNay } from '../types/authentication.type';
import { get_GW_Data } from '../utils/helper.util';

export async function generateAccessToken(username: string, isMedic: yayOrNay): Promise<string | null> {
    let resp_gateway = await get_GW_Data();
    const secret: string = resp_gateway[0]["secret"];
    const key: string = resp_gateway[0]["key"];
    if (secret && key) {
        const payload: jwt_payload = {
            username: username,
            isMedic: isMedic
        }
        return jwt.sign(payload, secret, { expiresIn: '15m', keyid: key });
    }
    return null;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err);

        if (err) return res.sendStatus(403);
        next();
    })
}
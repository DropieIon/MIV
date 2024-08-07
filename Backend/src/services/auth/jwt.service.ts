import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { get_GW_Data } from '../../utils/helper.util';
import { token_data } from '../../../../Common/types';

export async function generateAccessToken(username: string, role: string, canUpload: boolean, unlimitedUp4h: boolean): Promise<string | null> {
    let resp_gateway = await get_GW_Data();
    const secret: string = resp_gateway[0]["secret"];
    const key: string = resp_gateway[0]["key"];
    if (secret && key) {
        const payload: token_data = {
            username,
            role,
            canUpload,
            unlimitedUp4h
        }
        return jwt.sign(payload, secret, { expiresIn: '15m', keyid: key });
    }
    return null;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null || token === undefined) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err);

        if (err) return res.sendStatus(403);
        next();
    })
}
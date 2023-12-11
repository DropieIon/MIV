import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';

dotenv.config();

export function generateAccessToken(username: string): string | null {
    if(process.env.token_secret)
        return jwt.sign({ username }, process.env.token_secret, { expiresIn: '1h' });
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
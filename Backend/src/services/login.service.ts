import { generateAccessToken } from './jwt.service';
import { loginForm, resp_auth_services } from '../types/authentication.type';
import { checkLogin } from './db.service';
import type { yayOrNay } from '../types/authentication.type';


export async function loginUser(loginData: loginForm): Promise<resp_auth_services> {
    let resp_login = await checkLogin(loginData);
    if (["Y", "N"].includes(resp_login)) {
        const token = await generateAccessToken(loginData.username, resp_login as yayOrNay);
        if (token) {
            return { ok: true, data: token };
        }
        return { ok: false, data: "Cannot generate token" };
    }
    return { ok: false, data: resp_login };

}
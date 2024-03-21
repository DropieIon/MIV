import { generateAccessToken } from './jwt.service';
import { loginForm, resp_common_services } from '../../types/authentication.type';
import { checkLogin } from '../db/db-auth.service';


export async function loginUser(loginData: loginForm): Promise<resp_common_services> {
    let resp_login = await checkLogin(loginData);
    if (typeof resp_login !== "string") {
        if(resp_login.email_validation === 'N'){
            return { ok: false, data: 'Please verify email first' };
        }
        const token = await generateAccessToken(loginData.username, resp_login.isMedic);
        if (token) {
            return { ok: true, data: token };
        }
        return { ok: false, data: "Cannot generate token" };
    }
    return { ok: false, data: resp_login };

}
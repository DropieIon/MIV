import { generateAccessToken } from './jwt.service';
import { loginForm, resp_common_services, resp_login_service } from '../../types/auth/authentication.type';
import { checkLogin } from '../db/auth/db-auth.service';


export async function loginUser(loginData: loginForm): Promise<resp_login_service | resp_common_services> {
    let resp_login = await checkLogin(loginData);
    if (typeof resp_login !== "string") {
        if(resp_login.email_validation === 'N'){
            return { ok: false, data: 'Please verify email first' };
        }
        const token = await generateAccessToken(loginData.username, resp_login.isMedic);
        if (token) {
            return { 
                ok: true,
                data: {
                    token: token,
                    fullName: resp_login.fullName
                }
        };
        }
        return { ok: false, data: "Cannot generate token" };
    }
    return { ok: false, data: resp_login };

}
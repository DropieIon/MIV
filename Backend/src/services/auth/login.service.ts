import { generateAccessToken } from './jwt.service';
import { loginForm, resp_common_services, resp_login_service } from '../../types/auth/authentication.type';
import { checkLogin, dbCanUpload, dbUnlimitedUploads4h } from '../db/auth/db-auth.service';


export async function loginUser(loginData: loginForm): Promise<resp_login_service | resp_common_services> {
    let resp_login = await checkLogin(loginData);
    if (typeof resp_login !== "string") {
        if(resp_login.email_validation === 'N'){
            return { ok: false, data: 'Please verify email first' };
        }
        // a doctor should always be able to upload studies
        const canUpload = resp_login.isMedic ? true : await dbCanUpload(loginData.username);
        if(typeof canUpload === "string")
            return {ok: false, data: canUpload};
        const unlimitedUploads = resp_login.isMedic ? true : await dbUnlimitedUploads4h(loginData.username);
        if(typeof unlimitedUploads === "string")
            return {ok: false, data: unlimitedUploads};
        const token = await generateAccessToken(loginData.username, resp_login.isMedic, canUpload, unlimitedUploads);
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
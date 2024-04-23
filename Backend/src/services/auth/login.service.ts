import { generateAccessToken } from './jwt.service';
import { loginForm, resp_common_services, resp_login_service } from '../../types/auth/authentication.type';
import { checkLogin, dbCanUpload } from '../db/auth/db-auth.service';
import { dbCheckUnlimUploads4h } from '../db/account_data/db-upload.service';


export async function loginUser(loginData: loginForm): Promise<resp_login_service | resp_common_services> {
    let resp_login = await checkLogin(loginData);
    if (typeof resp_login !== "string") {
        if (resp_login.email_validation === 'N') {
            return { ok: false, data: 'Please verify email first' };
        }
        const medic = resp_login.isMedic === 'Y';
        // a doctor should always be able to upload studies
        const canUpload = medic ? true : await dbCanUpload(loginData.username);
        if (typeof canUpload === "string")
            return { ok: false, data: canUpload };
        const unlimitedUploads = medic ? true : await dbCheckUnlimUploads4h(loginData.username);
        if (typeof unlimitedUploads === "string")
            return { ok: false, data: unlimitedUploads };
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
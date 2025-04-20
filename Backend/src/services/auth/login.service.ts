import { generateAccessToken } from './jwt.service';
import { loginForm, resp_common_services, resp_login_service } from '../../types/auth/authentication.type';
import { checkLogin, dbCanUpload } from '../db/auth/db-auth.service';
import { dbCheckUnlimUploads4h } from '../db/account_data/db-upload.service';
import { logger } from '../../utils/logger';


export async function loginUser(loginData: loginForm): Promise<resp_login_service | resp_common_services> {
    let resp_login = await checkLogin(loginData);
    if (typeof resp_login !== "string") {
        if (resp_login.email_validation === 'N') {
            logger.error({
                message: 'Email not verified',
                labels: {
                    "origin": "svc"
                }
            });
            return { ok: false, data: 'Please verify email first' };
        }
        const medic = resp_login.role === 'med';
        // a doctor should always be able to upload studies
        const canUpload = medic ? true : await dbCanUpload(loginData.username);
        if (typeof canUpload === "string") {
            logger.error({
                message: canUpload,
                labels: {
                    "origin": "svc"
                }
            });
            return { ok: false, data: canUpload };
        }
        const unlimitedUploads = medic ? true : await dbCheckUnlimUploads4h(loginData.username);
        if (typeof unlimitedUploads === "string") {
            logger.error({
                message: unlimitedUploads,
                labels: {
                    "origin": "svc"
                }
            });
            return { ok: false, data: unlimitedUploads };
        }
        const token = await generateAccessToken(loginData.username, resp_login.role, canUpload, unlimitedUploads);
        if (token) {
            logger.info({
                message: "Generated token",
                labels: {
                    "origin": "svc"
                }
            });
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
    logger.error({
        message: resp_login,
        labels: {
            "origin": "svc"
        }
    });
    return { ok: false, data: resp_login };

}
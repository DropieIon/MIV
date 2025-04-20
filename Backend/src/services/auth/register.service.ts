import { insert_user } from '../db/auth/db-auth.service';
import { sendRegisterEmail } from './email.service';
import { v4 as uuidv4 } from 'uuid';
import { registerForm, resp_common_services } from '../../types/auth/authentication.type';
import { logger } from '../../utils/logger';


export async function create_user(registerData: registerForm): Promise<resp_common_services> {
    let uuid = uuidv4();
    const { email } = registerData;
    let rez = await insert_user(registerData, uuid);
    if (rez === "") {
        // success
        rez = await sendRegisterEmail(email, uuid);
        if(rez === "")
        {
            logger.info({
                message: "Successfully registered",
                labels: {
                    "origin": "svc"
                }
            });
            return { ok: true, data: "Successfully registered" };
        }
        else {
            logger.error({
                message: rez,
                labels: {
                    "origin": "svc"
                }
            });
            return {ok: false, data: rez};
        }
    }
    logger.error({
        message: rez,
        labels: {
            "origin": "svc"
        }
    });
    return { ok: false, data: rez };

}
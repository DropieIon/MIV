import { insert_user } from './db-auth.service';
import { sendRegisterEmail } from './email.service';
import { v4 as uuidv4 } from 'uuid';
import { registerForm, resp_common_services } from '../types/authentication.type';


export async function create_user(registerData: registerForm): Promise<resp_common_services> {
    let uuid = uuidv4();
    const { email } = registerData;
    let rez = await insert_user(registerData, uuid);
    if (rez === "") {
        // success
        rez = await sendRegisterEmail(email, uuid);
        if(rez === "")
        {
            return { ok: true, data: "Successfully registered" };
        }
        else
            return {ok: false, data: rez};
    }
    return { ok: false, data: rez };

}
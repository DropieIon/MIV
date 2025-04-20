import { transporter } from "../../configs/email.config";
import { HTML_TEMPLATE } from '../../../templates/registerEmail.template'
import { logger } from '../../utils/logger';

export async function sendRegisterEmail(receiver: string, uuid: string): Promise<string> {
    const mailDetails = {
        from: process.env.email_user,
        to: receiver,
        subject: "Register email",
        text: "",
        html: HTML_TEMPLATE(`Register your email here: ${process.env.backend_url}/register/${uuid}`),
    }
    try {
        const info = await transporter.sendMail(mailDetails)
        logger.info({
            message: "Email sent",
            labels: {
                "origin": "svc"
            }
        });
        return "";
    } catch (error) {
        logger.error({
            message: "Error sending email",
            labels: {
                "origin": "svc"
            }
        });
        return error as string;
    }
};
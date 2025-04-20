import sZip from 'node-stream-zip';
import { logger } from '../../../utils/logger';

export async function extractZip(path: string, userWUID: string) {
    const zip = new sZip.async({
        file: path
        , storeEntries: true
    });
    try {
        const count = await zip.extract(null, `./tmp/${userWUID}`);
        logger.info({
            message: `Extracted ${count} entries`,
            labels: {
                "origin": "svc"
            }
        });
        zip.close();
    } catch (error) {
        logger.error({
            message: "Error extracting zip file",
            labels: {
                "origin": "svc"
            }
        });

    }
};


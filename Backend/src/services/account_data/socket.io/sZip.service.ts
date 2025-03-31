
import sZip from 'node-stream-zip';

export async function extractZip(path: string, userWUID: string) {
    const zip = new sZip.async({
        file: path
        , storeEntries: true
    });
    try {
        const count = await zip.extract(null, `./tmp/${userWUID}`);
        console.log(`Extracted ${count} entries`);
        zip.close();
    } catch (error) {
        console.log("err", error);

    }
};


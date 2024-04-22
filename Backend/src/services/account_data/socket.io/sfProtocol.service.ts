import { appendFileSync, createWriteStream, mkdir, mkdirSync, readFileSync, rmSync, unlink } from "fs";
import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import { createMD5, get_GW_Data, parseJwt } from "../../../utils/helper.util";
import { handShake, splitFile, EOS } from '../../../../../Common/types';
import { v4 as uuidv4 } from 'uuid';
import { extractZip } from "./sZip.service";
import { parseDICOMFolder } from "./parseUpload.service";


export class sfProtocol {
    private size: number = 0;
    private nrOfPackets: number = 0;
    private sizeOfPkg: number = 0;
    private pkgNr: number = 0;
    private sock: Socket;
    private user: string = '';
    private pathToTemp = '/app/tmp';
    private zipName: string = '';
    private folderName: string = '';
    checkHandshake = (): boolean => {
        if (this.size === 0 || this.nrOfPackets === 0) {
            this.sock.emit('err', { message: 'Bad handshake' });
            return false;
        }
        return true;
    }
    constructor(socket: Socket) {
        this.sock = socket;
        this.sock.on('split-file', (data: handShake | splitFile | EOS, callback) => {
            try {
                switch (data.type) {
                    case 'handshake':
                        get_GW_Data()
                            .then((resp_gateway) => {
                                const secret: string = resp_gateway[0]["secret"];
                                jwt.verify(data.token, secret, (err: any) => {
                                    if (err !== null) {
                                        this.sock.emit('err', { message: 'Invalid token' });
                                        return;
                                    }
                                    // TODO: check if the user can upload requested size
                                    this.size = data.size;
                                    this.nrOfPackets = data.nrOfPackets;
                                    this.sizeOfPkg = Math.ceil(data.size / data.nrOfPackets * 1.5);
                                    const tknBody = parseJwt(data.token);
                                    const medic = tknBody?.isMedic === 'Y';
                                    this.user = medic ? data.user : tknBody?.username;
                                    this.folderName = `${this.user}_${uuidv4()}`;
                                    this.zipName = `${this.pathToTemp}/${this.folderName}.zip`;
                                    console.log("Handshake successfull");
                                    callback({
                                        success: true 
                                    });
                                });
                            });
                        break;
                    case 'splitFile':
                        // initial checks
                        if (!this.checkHandshake()) {
                            this.sock.disconnect();
                            return;
                        }
                        const pkg = Buffer.from(data.data, 'base64');
                        const pkgSize = pkg.byteLength;
                        if (pkgSize > this.sizeOfPkg) {
                            this.sock.emit('err', { message: 'Packet is bigger than expected' });
                            this.sock.disconnect();
                            return;
                        }
                        this.pkgNr++;
                        if (this.pkgNr > this.nrOfPackets) {
                            console.log("bad");

                            this.sock.emit('err', { message: 'Way too many packets' });
                            this.sock.disconnect();
                            return;
                        }
                        // console.log("Checked", this.pkgNr);
                        appendFileSync(this.zipName, pkg);
                        socket.emit('progress', (this.pkgNr / this.nrOfPackets).toFixed(2));
                        break;
                    case 'EOS':
                        if (!this.checkHandshake()) {
                            return;
                        }
                        if(data.canceled) {
                            unlink(this.zipName, (err) => {
                                if (err)
                                    console.error("Err deleting file" + err);
                                else
                                    console.log("File deleted.");
                            });
                        }
                        else {
                            createMD5(this.zipName)
                                .then((md5) => {
                                    if (md5 !== data.md5) {
                                        this.sock.emit('err', { message: 'Corrupted file received' });
                                        this.sock.disconnect();
                                        unlink(this.zipName, (err) => {
                                            if (err)
                                                console.error("Err deleting file" + err);
                                            else
                                                console.log("File deleted.");
                                        })
                                    }
                                    else {
                                        extractZip(this.zipName, this.folderName)
                                            .then(() => {
                                                unlink(this.zipName, (err) => {
                                                    if (err)
                                                        console.error("Err deleting file" + err);
                                                    else
                                                        console.log("File deleted.");
                                                });
                                                console.log("Zip extracted.");
                                                const pathFolder = `${this.pathToTemp}/${this.folderName}`;
                                                parseDICOMFolder(pathFolder, this.user)
                                                .then(() => {
                                                    // delete folder after 5 mins
                                                    setTimeout(() => {
                                                        rmSync(pathFolder, {
                                                            recursive: true,
        
                                                            force: true
                                                        })
                                                    }, 300000);
                                                });
                                            });
                                    }
                                    this.sock.disconnect();
                                });
                        }
                        break;
                    default:
                        console.error('Wrong type');
                        break;
                }
            } catch (error) {
                console.log("Error ws: " + error);

            }
        });
    }

}

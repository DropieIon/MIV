import { appendFileSync, readFileSync, rmSync, unlink } from "fs";
import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import { createMD5, get_GW_Data, parseJwt } from "../../../utils/helper.util";
import { handShake, splitFile, EOS } from '../../../../../Common/types';
import { v4 as uuidv4 } from 'uuid';
import { extractZip } from "./sZip.service";
import { parseDICOMFolder } from "./parseUpload.service";
import { dbCheckUnlimUploads4h, dbCheckUpload } from "../../db/account_data/db-upload.service";
import { Express } from "express";

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
    constructor(socket: Socket, app: Express) {
        // register the on-stable event
        app.get('/on-stable/:studyInstanceUID', (req, res) => {
            // avoid false positives
            const pathFolder = `${this.pathToTemp}/${this.folderName}`;
            parseDICOMFolder(pathFolder, this.user, true)
            .then((studyUID) => {
                    console.log("on-stable", req.params.studyInstanceUID, studyUID);
                    if (req.params.studyInstanceUID === studyUID) {
                        socket.emit('on-stable', {});
                        rmSync(pathFolder, {
                            recursive: true,
                            force: true
                        })
                        setTimeout(() => {
                            socket.disconnect(true);  
                        }, 1000);
                    }
                });
            res.send('ok');
        });
        this.sock = socket;
        this.sock.on('split-file', (data: handShake | splitFile | EOS, callback) => {
            try {
                switch (data.type) {
                    case 'handshake':
                        get_GW_Data()
                            .then((resp_gateway) => {
                                const secret: string = resp_gateway[0]["secret"];
                                jwt.verify(data.token, secret, async (err: any) => {
                                    if (err !== null) {
                                        this.sock.emit('err', { message: 'Invalid token' });
                                        this.sock.disconnect(true);
                                        return;
                                    }
                                    const tknBody = parseJwt(data.token);
                                    const medic = tknBody?.role === 'med';
                                    this.user = medic ? data.user : tknBody?.username;
                                    const allowedUnlim4h = medic ? true : await dbCheckUnlimUploads4h(this.user);
                                    if(typeof allowedUnlim4h === 'string')
                                    {
                                        callback({
                                            success: false
                                        });
                                        this.sock.disconnect(true);
                                        return;
                                    }
                                    this.size = data.size;
                                    if(!medic) {
                                        if (!allowedUnlim4h) {
                                            const canUpload = await dbCheckUpload(this.user, this.size)
                                            if (typeof canUpload === 'string') {
                                                this.sock.emit('err', canUpload);
                                                this.sock.disconnect(true);
                                                return;
                                            }
                                            if (!canUpload) {
                                                callback({
                                                    success: false
                                                });
                                                this.sock.disconnect(true);
                                                return;
                                            }
                                        }
                                    }
                                    this.nrOfPackets = data.nrOfPackets;
                                    this.sizeOfPkg = Math.ceil(data.size / data.nrOfPackets * 1.5);
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
                            this.sock.disconnect(true);
                            return;
                        }
                        const pkg = Buffer.from(data.data, 'base64');
                        const pkgSize = pkg.byteLength;
                        if (pkgSize > this.sizeOfPkg) {
                            this.sock.emit('err', { message: 'Packet is bigger than expected' });
                            this.sock.disconnect(true);
                            return;
                        }
                        this.pkgNr++;
                        if (this.pkgNr > this.nrOfPackets) {
                            this.sock.emit('err', { message: 'Way too many packets' });
                            this.sock.disconnect(true);
                            return;
                        }
                        appendFileSync(this.zipName, pkg);
                        socket.emit('progress', (this.pkgNr / this.nrOfPackets).toFixed(2));
                        break;
                    case 'EOS':
                        if (!this.checkHandshake()) {
                            this.sock.disconnect(true);
                            return;
                        }
                        if(data.canceled) {
                            this.sock.emit('err', { message: 'Upload canceled' });
                            this.sock.disconnect(true);
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
                                        console.log("Corrupted zip received");
                                        this.sock.disconnect(true);
                                        unlink(this.zipName, (err) => {
                                            if (err)
                                                console.error("Err deleting file" + err);
                                            else
                                                console.log("File deleted.");
                                        });
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
                                                const pathFolder = `${this.pathToTemp}/${this.folderName}`;
                                                parseDICOMFolder(pathFolder, this.user, false);
                                            });
                                    }
                                });
                        }
                        break;
                    default:
                        console.error('Wrong type');
                        break;
                }
            } catch (error) {
                console.log("Error ws: " + error);
                this.sock.disconnect(true);

            }
        });
    }

}

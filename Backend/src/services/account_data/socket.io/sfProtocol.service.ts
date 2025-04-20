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
import { logger } from "../../../utils/logger";

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
            logger.error({
                message: "Bad handshake",
                labels: {
                    "origin": "svc"
                }
            });
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
                    logger.info({
                        message: "on-stable",
                        labels: {
                            "origin": "svc"
                        }
                    });
                    if (req.params.studyInstanceUID === studyUID) {
                        logger.info({
                            message: "Sent on-stable",
                            labels: {
                                "origin": "svc"
                            }
                        });
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
                        logger.info({
                            message: "Received split-file handshake",
                            labels: {
                                "origin": "svc"
                            }
                        });
                        get_GW_Data()
                            .then((resp_gateway) => {
                                const secret: string = resp_gateway[0]["secret"];
                                jwt.verify(data.token, secret, async (err: any) => {
                                    if (err !== null) {
                                        logger.error({
                                            message: "Invalid token",
                                            labels: {
                                                "origin": "svc"
                                            }
                                        });
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
                                        logger.error({
                                            message: `Limit error: ${allowedUnlim4h}`,
                                            labels: {
                                                "origin": "svc"
                                            }
                                        });
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
                                                logger.error({
                                                    message: `canUpload error: ${canUpload}`,
                                                    labels: {
                                                        "origin": "svc"
                                                    }
                                                });
                                                this.sock.emit('err', canUpload);
                                                this.sock.disconnect(true);
                                                return;
                                            }
                                            if (!canUpload) {
                                                logger.error({
                                                    message: 'Cannot upload',
                                                    labels: {
                                                        "origin": "svc"
                                                    }
                                                });
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
                                    logger.info({
                                        message: "Handshake successfull",
                                        labels: {
                                            "origin": "svc"
                                        }
                                    });
                                    callback({
                                        success: true
                                    });
                                });
                            });
                        break;
                    case 'splitFile':
                        // initial checks
                        if (!this.checkHandshake()) {
                            logger.error({
                                message: "Handshake error",
                                labels: {
                                    "origin": "svc"
                                }
                            });
                            this.sock.disconnect(true);
                            return;
                        }
                        const pkg = Buffer.from(data.data, 'base64');
                        const pkgSize = pkg.byteLength;
                        if (pkgSize > this.sizeOfPkg) {
                            logger.error({
                                message: `Packet is bigger than expected ${pkgSize}`,
                                labels: {
                                    "origin": "svc"
                                }
                            });
                            this.sock.emit('err', { message: 'Packet is bigger than expected' });
                            this.sock.disconnect(true);
                            return;
                        }
                        this.pkgNr++;
                        if (this.pkgNr > this.nrOfPackets) {
                            logger.error({
                                message: `Way too many packets ${this.pkgNr}`,
                                labels: {
                                    "origin": "svc"
                                }
                            });
                            this.sock.emit('err', { message: 'Way too many packets' });
                            this.sock.disconnect(true);
                            return;
                        }
                        appendFileSync(this.zipName, pkg);
                        socket.emit('progress', (this.pkgNr / this.nrOfPackets).toFixed(2));
                        break;
                    case 'EOS':
                        if (!this.checkHandshake()) {
                            logger.error({
                                message: "EOS Handshake error",
                                labels: {
                                    "origin": "svc"
                                }
                            });
                            this.sock.disconnect(true);
                            return;
                        }
                        if(data.canceled) {
                            logger.warn({
                                message: "Upload canceled",
                                labels: {
                                    "origin": "svc"
                                }
                            });
                            this.sock.emit('err', { message: 'Upload canceled' });
                            this.sock.disconnect(true);
                            unlink(this.zipName, (err) => {
                                if (err)
                                    logger.error({
                                        message: "Err deleting file" + err,
                                        labels: {
                                            "origin": "svc"
                                        }
                                    });
                                else
                                    logger.info({
                                        message: "File deleted.",
                                        labels: {
                                            "origin": "svc"
                                        }
                                    });
                            });
                        }
                        else {
                            createMD5(this.zipName)
                                .then((md5) => {
                                    if (md5 !== data.md5) {
                                        this.sock.emit('err', { message: 'Corrupted file received' });
                                        logger.error({
                                            message: "Corrupted zip received",
                                            labels: {
                                                "origin": "svc"
                                            }
                                        });
                                        this.sock.disconnect(true);
                                        unlink(this.zipName, (err) => {
                                            if (err)
                                                logger.error({
                                                    message: "Err deleting file" + err,
                                                    labels: {
                                                        "origin": "svc"
                                                    }
                                                });
                                            else
                                                logger.info({
                                                    message: "File deleted.",
                                                    labels: {
                                                        "origin": "svc"
                                                    }
                                                });
                                        });
                                    }
                                    else {
                                        extractZip(this.zipName, this.folderName)
                                            .then(() => {
                                                unlink(this.zipName, (err) => {
                                                    if (err)
                                                        logger.error({
                                                            message: "Err deleting file" + err,
                                                            labels: {
                                                                "origin": "svc"
                                                            }
                                                        });
                                                    else
                                                        logger.info({
                                                            message: "File deleted.",
                                                            labels: {
                                                                "origin": "svc"
                                                            }
                                                        });
                                                });
                                                const pathFolder = `${this.pathToTemp}/${this.folderName}`;
                                                logger.info({
                                                    message: `Started parsing folder for user: ${this.user}`,
                                                    labels: {
                                                        "origin": "svc"
                                                    }
                                                });
                                                parseDICOMFolder(pathFolder, this.user, false);
                                            });
                                    }
                                });
                        }
                        break;
                    default:
                        logger.error({
                            message: 'Wrong type',
                            labels: {
                                "origin": "svc"
                            }
                        });
                        break;
                }
            } catch (error) {
                logger.error({
                    message: "Error ws: " + error,
                    labels: {
                        "origin": "svc"
                    }
                });
                this.sock.disconnect(true);
            }
        });
    }
}

import { 
    Modal,
    Text,
    TouchableOpacity,
    View
 } from "react-native";
import * as Progress from 'react-native-progress';
import { uploadStyles } from "./UploadStyles";
import { useEffect, useRef, useState } from "react";
import * as FileSystem from 'expo-file-system';
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { sendBytes, sendEOS } from '../../../../dataRequests/socket.io/uploadFileWs';
import { handShake } from '../../../../../Common/types'
import { useSelector } from "react-redux";
import { selectAccountDetails, selectServerAddress, selectToken } from "../../../../features/globalStateSlice";
import { parseJwt } from "../../../../utils/helper";

type propsTemplate = {
    setOpenUpload,
    setToastMsg,
    setRefreshList,
    zipUri: string,
    zipSize: number,
}

type callbackRet = {
    success: boolean,
}

export function OpenUpload(props: propsTemplate) {
    const serverAddress = useSelector(selectServerAddress);
    const token = useSelector(selectToken);
    const medic = parseJwt(token)?.role === 'med';
    const accDetails = useSelector(selectAccountDetails);
    const [uploadProgress, setUploadProgress] = useState(0.0);
    const [sock, setSock] = useState<Socket>(null);
    let cancelEnabled = true;
    const sendZip = async () => {
        const { zipSize, zipUri } = props;
        const fInfo = await FileSystem.getInfoAsync(zipUri, { md5: true });
        const md5 = fInfo.exists ? fInfo.md5 : '';
        let bytes: string;
        // 1 MB
        const nrOfBytes = 1048576;
        const nrPack = Math.ceil(zipSize / nrOfBytes);
        let pos = 0;

        // begin transmission of file
        let socket: Socket;
        try {
            socket = io(`${serverAddress}`, {
                reconnectionDelayMax: 10000,
                transports: ["websocket"],
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                    ConnType: 'upload'
                }
            });
        } catch (error) {
            props.setToastMsg("Could not create socket to server " + error);
            return;
        }
        setSock(socket);
        const mainEv = 'split-file';
        const toSend: handShake = {
            type: 'handshake',
            size: zipSize,
            nrOfPackets: nrPack,
            token,
            // if it's a medic it can send the username for the patient
            // that the study belongs to
            user: medic ? accDetails.username : ''
        };
        socket.on('disconnect',  () => {
            console.log("disconnected");
            
        })
        socket.on('err', (err) => {
            props.setToastMsg(err.message);
        });
        socket.on('on-stable', () => {
            props.setToastMsg("Study Uploaded");
            props.setRefreshList(Math.random());
        });
        let sent_eos: boolean = false;
        socket.on('progress', async (p: string) => {
            const progress = parseFloat(p);
            setUploadProgress(progress);
            bytes = await FileSystem.readAsStringAsync(zipUri, {
                encoding: 'base64',
                length: nrOfBytes,
                position: pos
            });
            if(bytes.length !== 0)
                sendBytes(socket, bytes);
            pos += nrOfBytes;
            if(!sent_eos && pos >= zipSize)
                {
                    sent_eos = true;
                    sendEOS(socket, md5, false);
                }

        })
        socket.emit(mainEv, toSend, async (d: callbackRet) => {
            // only after it was acknowledged
            if (d.success) {
                bytes = await FileSystem.readAsStringAsync(zipUri, {
                    encoding: 'base64',
                    length: nrOfBytes,
                    position: pos
                });
                sendBytes(socket, bytes);
                pos += nrOfBytes;
            }
            else {
                props.setOpenUpload(false);
                props.setToastMsg("Upload limit reached");
            }
        });
    }
    useEffect(() => {
        sendZip();
    }, []);
    if (uploadProgress === 1) {
        cancelEnabled = false;
        setTimeout(() => {
            props.setToastMsg("Parsing...");
            props.setOpenUpload(false);
        }, 500);
    }
    return (
        <Modal
            animationType='fade'
            transparent={true}
        >
            <View
                style={uploadStyles.mainView}
            >
                <View
                    style={uploadStyles.progressView}
                >
                    <Progress.Circle
                        progress={uploadProgress}
                        size={200}
                        showsText={true}
                        thickness={20}
                        color="#1cf28c"
                    />
                </View>
                <TouchableOpacity
                    style={uploadStyles.cancelButton}
                    disabled={!cancelEnabled}
                    onPress={() => {
                        sendEOS(sock, '', true);
                        props.setOpenUpload(false);
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: 'white'
                        }}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}
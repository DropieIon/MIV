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
import { io, Socket } from "socket.io-client";
import { sendBytes, sendEOS } from '../../../../dataRequests/socket.io/uploadFileWs';
import { handShake } from '../../../../../Common/types'
import { useSelector } from "react-redux";
import { selectAccountDetails, selectServerAddress, selectToken } from "../../../../features/globalStateSlice";
import { parseJwt } from "../../../../utils/helper";

type propsTemplate = {
    setOpenUpload,
    setErrUpload,
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
        // 10 MB
        const nrOfBytes = 10485760;
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
            socket.on('disconnect', (d) => {
                console.log("Disconnected");
            });
        } catch (error) {
            props.setErrUpload("Could not create socket to server " + error);
            return;
        }
        setSock(socket);
        let rez;
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
        socket.on('err', (err) => {
            props.setErrUpload("HandShake error " + err.message);
        });
        socket.on('progress', (p: string) => {
            const progress = parseFloat(p);
            if (uploadProgress < progress)
                setUploadProgress(progress);
        })
        socket.emit(mainEv, toSend, async (d: callbackRet) => {
            // only after it was acknowledged
            if (d.success) {
                for (let ind = 0; ind < nrPack; ind++) {
                    bytes = await FileSystem.readAsStringAsync(zipUri, {
                        encoding: 'base64',
                        length: nrOfBytes,
                        position: pos
                    });
                    rez = await sendBytes(socket, bytes);
                    pos += nrOfBytes;
                }
                rez = await sendEOS(socket, md5, false);
            }
            else {
                props.setOpenUpload(false);
                props.setErrUpload("Upload limit reached");
            }
        });
    }
    useEffect(() => {
        sendZip();
    }, []);
    if (uploadProgress === 1) {
        cancelEnabled = false;
        setTimeout(() => {
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
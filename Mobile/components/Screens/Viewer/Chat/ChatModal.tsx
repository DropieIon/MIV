import {
    Modal,
    View,
    TouchableOpacity
} from "react-native";
import { ChatStyles } from "./ChatStyles";
import { MessageBox } from "./MessageBox";
import { Conversation } from "./Conversation/Conversation";
import { useEffect, useRef, useState } from "react";
import { messageData } from "../../../../../Common/types";
import { useDispatch, useSelector } from "react-redux";
import { selectOpenViewer, selectServerAddress, selectToken, setChatNewMessage, setChatPfps } from "../../../../features/globalStateSlice";
import { AntDesign } from '@expo/vector-icons';
import { DetailsStyles } from "../../PatAndStudies/OpenDetails/DetailsStyles";
import { Socket, io } from "socket.io-client";
import { getPfpsStudy } from "../../../../dataRequests/PatientData";

type propsTemplate = {
    setShowChat,
    study_id: string,
}

export function ChatModal(props: propsTemplate) {
    const [messagesList, setMessagesList] = useState<messageData[]>([]);
    const dispatch = useDispatch();
    const serverAddress = useSelector(selectServerAddress);
    // all the pfps for each account that has sent a message on the study
    const token = useSelector(selectToken);
    const openViewer = useSelector(selectOpenViewer);
    const study_id = openViewer.study_id;
    const socket = useRef<Socket>(null);
    
    const closeSock = () => {
        socket.current.disconnect();
    }
    const appendMsg = (msg: string) => {
        if (msg !== "") {
            socket.current.emit('msg-to-serv', {
                study_id,
                message: msg
            });
        }
    }
    useEffect(() => {
        getPfpsStudy(token, study_id)
        .then((data) => {
            dispatch(setChatPfps(data));
        });
        try {
            if(!socket.current) {
                socket.current = io(`${serverAddress}`, {
                    reconnectionDelayMax: 10000,
                    extraHeaders: {
                        Authorization: `Bearer ${token}`,
                        ConnType: 'study-chat',
                        study_id: study_id
                    }
                });
                socket.current.on('msg-from-srv', (data: messageData) => {
                    dispatch(setChatNewMessage({
                        message: data.message,
                        timestamp: data.timestamp,
                        senderUsername: data.senderUsername
                    }));
                });
                socket.current.on('err', (data: string) => {
                    console.error('Communication error: ', data);
                });
                socket.current.on('disconnect', (d) => {
                    console.log("Disconnected");
    
                });
            }
        } catch (error) {
            return;
        }
        socket.current.emit('get-messages', {
            study_id
        }, (data: messageData[]) => {
            setMessagesList(data);
        });
    }, []);
    return (
        <Modal
            animationType='slide'
            transparent={true}
        >
            <View
                style={ChatStyles.mainView}
            >
                <TouchableOpacity
                    style={DetailsStyles.headercloseButton}
                    onPress={() => {
                        closeSock();
                        dispatch(setChatNewMessage(null));
                        props.setShowChat(false);
                    }}
                >
                    <AntDesign
                        name="closecircle"
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
                <Conversation
                    messagesList={messagesList}
                />
                <MessageBox
                    appendMsg={appendMsg}
                />
            </View>

        </Modal>
    )
}
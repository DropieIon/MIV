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
import { useSelector } from "react-redux";
import { selectChatData, selectCurrentAccountUsername, selectOpenViewer, selectToken } from "../../../../features/globalStateSlice";
import { AntDesign } from '@expo/vector-icons';
import { DetailsStyles } from "../../PatAndStudies/OpenDetails/DetailsStyles";
import { Socket, io } from "socket.io-client";
import { backend_url } from "../../../../configs/backend_url";

type propsTemplate = {
    setShowChat,
}

export function ChatModal(props: propsTemplate) {
    const [messagesList, setMessagesList] = useState<messageData[]>(null);
    const token = useSelector(selectToken);
    const currentUsername = useSelector(selectCurrentAccountUsername);
    const openViewer = useSelector(selectOpenViewer);
    const chatData = useSelector(selectChatData);
    const study_id = openViewer.study_id;
    const socket = useRef<Socket>(null);
    
    const closeSock = () => {
        socket.current.disconnect();
    }
    const appendMsg = (msg: string) => {
        if (msg !== "") {
            socket.current.emit('msg-to-serv', {
                recv: chatData.recvUser,
                study_id,
                message: msg
            });
            setMessagesList(messagesList.concat({
                message: msg,
                timestamp: new Date().getTime(),
                read: false,
                senderUsername: currentUsername
            }));
        }
    }
    useEffect(() => {
        try {
            socket.current = io(`${backend_url}`, {
                reconnectionDelayMax: 10000,
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                    ConnType: 'study-chat'
                }
            });
            socket.current.on('err', (data: string) => {
                console.error('Communication error: ', data);
            });
            socket.current.on('disconnect', (d) => {
                console.log("Disconnected");

            });
        } catch (error) {
            // props.setErrUpload("Could not create socket to server " + error);
            return;
        }
        // TODO: get this from server
        setMessagesList(
            [
                {
                    message: "daaaaaa",
                    read: false,
                    timestamp: 1715240930206,
                    senderUsername: 'doctor1'
                },
                {
                    message: "nah fam",
                    read: true,
                    timestamp: 1715240930207,
                    senderUsername: 'patient1'
                },
                {
                    message: "nah famm",
                    read: true,
                    timestamp: 1715040930208,
                    senderUsername: 'doctor1'
                }
            ]
        );
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
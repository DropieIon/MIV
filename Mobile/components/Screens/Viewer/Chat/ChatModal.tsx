import {
    Modal,
    View,
} from "react-native";
import { ChatStyles } from "./ChatStyles";
import { MessageBox } from "./MessageBox";
import { Conversation } from "./Conversation/Conversation";
import { useEffect, useState } from "react";
import { messageData } from "../../../../../Common/types";
import { useSelector } from "react-redux";
import { selectCurrentAccountUsername } from "../../../../features/globalStateSlice";

export function ChatModal(props) {
    const [messagesList, setMessagesList] = useState<messageData[]>(null);
    const currentUsername = useSelector(selectCurrentAccountUsername);
    const appendMsg = (msg: string) => {
        if (msg !== "") {

            setMessagesList(messagesList.concat({
                message: msg,
                timestamp: new Date().getTime(),
                read: false,
                senderUsername: currentUsername
            }));
        }
    }
    useEffect(() => {
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
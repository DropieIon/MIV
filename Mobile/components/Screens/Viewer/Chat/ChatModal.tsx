import {
    Modal,
    View,
    StyleSheet
} from "react-native";
import { ChatStyles } from "./ChatStyles";
import { MessageBox } from "./MessageBox";
import { Conversation } from "./Conversation/Conversation";


export function ChatModal(props) {
    return (
        <Modal
            animationType='slide'
            transparent={true}
        >
            <View
                style={ChatStyles.mainView}
            >
                <Conversation />
                <MessageBox />
            </View>

        </Modal>
    )
}
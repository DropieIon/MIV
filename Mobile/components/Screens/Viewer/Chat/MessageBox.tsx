import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ChatStyles } from "./ChatStyles";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

type propsTemplate = {
    appendMsg
}

const styles = StyleSheet.create({
    messageBoxInput: {
        width: "85%",
        height: "100%",
        backgroundColor: 'white',
        borderRadius: 50,
        textAlign: 'center'
    },

    sendButton: {
        width: '15%',
        left: '85%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: 'darkblue'
    }
})

export function MessageBox(props: propsTemplate) {
    const [message, setMessage] = useState("");
    return (
        <View
            style={ChatStyles.messageInputView}
        >
            <TextInput
                style={styles.messageBoxInput}
                onChangeText={setMessage}
                value={message}
                placeholder="Speak your mind"
            >
            </TextInput>
            <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                    props.appendMsg(message);
                    setMessage("");
                }}
            >
                <Ionicons
                    name="send"
                    size={24}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    );
}
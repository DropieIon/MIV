import { TextInput, TouchableOpacity, View } from "react-native";
import { ChatStyles } from "./ChatStyles";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

type propsTemplate = {
    appendMsg
}

export function MessageBox(props: propsTemplate) {
    const [message, setMessage] = useState("");
    return (
        <View
            style={ChatStyles.messageInputView}
        >
            <TextInput
                style={{
                    width: "85%",
                    height: "100%",
                    backgroundColor: 'grey',
                    borderRadius: 50,
                    textAlign: 'center'
                }}
                onChangeText={setMessage}
                value={message}
                placeholder="What'ya thinkin'?"
            >
            </TextInput>
            <TouchableOpacity
                style={{
                    width: '15%',
                    left: '85%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                    backgroundColor: 'darkblue'
                }}
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
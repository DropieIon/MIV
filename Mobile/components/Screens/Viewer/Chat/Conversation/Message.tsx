import { Text, View, Dimensions, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { selectChatPfps, selectCurrentAccountUsername } from "../../../../../features/globalStateSlice";
import { messageData, pfpsItem } from "../../../../../../Common/types";

type propsTemplate = {
    msgData: messageData,
}

const styles = StyleSheet.create({
    mainView: {
        height: Dimensions.get('window').height / 15,
        alignItems: 'center',
        flexDirection: 'row',
        paddingEnd: "2%",
        paddingStart: "2%"
    },

    messageView: {
        padding: "2%",
        borderRadius: 30,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    hourText: {
        height: "100%",
        textAlignVertical: 'bottom',
        paddingLeft: "2%"
    },
    usernameTxt: {
        position: 'absolute',
        top: 0,
    },
    pfpImg: {
        height: 30,
        width: 30,
        borderRadius: 30,
    }
})

export function Message(props: propsTemplate) {
    const currentUsername = useSelector(selectCurrentAccountUsername);
    const isCurrentAccount = currentUsername === props.msgData.senderUsername;
    const chatPfps: pfpsItem[] = useSelector(selectChatPfps);
    const getPfpForUser = (username: string) => {
        // find not working properly, sometimes returning undefined
        for (const e of chatPfps) {
            if(e.username === username)
                return e.pfp;
        }
    }
    
    return (
        <View
            style={[styles.mainView, { justifyContent: isCurrentAccount ? 'flex-end' : 'flex-start' }]}
        >
            {!isCurrentAccount &&
            <Image
                    style={styles.pfpImg}
                    source={{
                        uri: `data:image/png;base64,${getPfpForUser(props.msgData.senderUsername)}`
                    }}
                />}
            <View
                style={[styles.messageView,
                    {
                        right: isCurrentAccount ? "2%" : "auto",
                        left: !isCurrentAccount ? "2%" : "auto"
                    }]}
            >
                <Text
                    style={[styles.usernameTxt, { color: isCurrentAccount ? 'blue' : 'grey' }]}
                >
                    {props.msgData.senderUsername}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                  }}  
                >
                    {props.msgData.message}
                </Text>
                <View
                    style={{
                        height: "100%",
                    }}
                >
                    <Text
                        style={[styles.hourText,
                            { color: 'grey' }
                        ]}
                    >
                        {new Date(props.msgData.timestamp).toLocaleTimeString("en-US",
                            { hour12: false, hour: "2-digit", minute: "2-digit" })}
                    </Text>
                </View>
            </View>   
            {isCurrentAccount &&
            <Image
                style={[styles.pfpImg, { left: 3 }]}
                    source={{
                        uri: `data:image/png;base64,${getPfpForUser(props.msgData.senderUsername)}`
                    }}
                />}
        </View>
    );
}
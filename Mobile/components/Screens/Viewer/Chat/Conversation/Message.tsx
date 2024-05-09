import { Text, View, Dimensions } from "react-native";
import { defaultPfp } from "../../../../../configs/defaultUser.b64";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { selectCurrentAccountUsername, selectStudyChatUsername } from "../../../../../features/globalStateSlice";
import { messageData } from "../../../../../../Common/types";

type propsTemplate = {
    msgData: messageData
}

export function Message(props: propsTemplate) {
    // TODO: put this in the store
    const profile_pic = defaultPfp;
    const currentUsername = useSelector(selectCurrentAccountUsername);
    const studyChatUsername = useSelector(selectStudyChatUsername)
    console.log(studyChatUsername);
    
    const isCurrentAccount = currentUsername === props.msgData.senderUsername;
    return (
        <View
            style={{
                height: Dimensions.get('window').height / 15,
                alignItems: 'center',
                justifyContent: isCurrentAccount ? 'flex-end': 'flex-start',
                flexDirection: 'row',
                paddingEnd: "2%",
                paddingStart: "2%"
            }}
        >
            {!isCurrentAccount &&
            <Image
                    style={{
                        height: 30,
                        width: 30,
                        borderRadius: 30,
                    }}
                    source={{
                        uri: `data:image/png;base64,${profile_pic}`
                    }}
                />}
            <View
                style={{
                    right: isCurrentAccount ? "2%" : "auto",
                    left: !isCurrentAccount ? "2%" : "auto",
                    padding: "2%",
                    borderRadius: 30,
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
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
                        style={{
                            height: "100%",
                            color: (isCurrentAccount && props.msgData.read) ? 'blue' : 'grey',
                            textAlignVertical: 'bottom',
                            paddingLeft: "2%"
                        }}
                    >
                        {new Date(props.msgData.timestamp).toLocaleTimeString("en-US",
                            { hour12: false, hour: "2-digit", minute: "2-digit" })}
                    </Text>
                </View>
            </View>   
            {isCurrentAccount &&
            <Image
                    style={{
                        height: 30,
                        width: 30,
                        borderRadius: 30,
                        left: 3,
                    }}
                    source={{
                        uri: `data:image/png;base64,${profile_pic}`
                    }}
                />}
        </View>
    );
}
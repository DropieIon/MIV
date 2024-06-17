import { View, FlatList, Text } from "react-native";
import { Message } from "./Message";
import { messageData } from "../../../../../../Common/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectChatNewMessage } from "../../../../../features/globalStateSlice";

type propsTemplate = {
    date: string,
    messages: messageData[],
}

function dateToLongName(date: string): string {
    // there was a problem with parsing the dates,
    // returning NaN, so this is a workaround
    const date_split = date.split('/');
    const dateTime = new Date().setFullYear(parseInt(date_split[2]), parseInt(date_split[0]) - 1, parseInt(date_split[1]));
    return new Date(dateTime).toLocaleDateString("en-US", {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
    });
}

export function MessagesFromOneDay(props: propsTemplate) {
    const [msgOneDay, setMsgOneDay] = useState(props.messages);
    const newMessage = useSelector(selectChatNewMessage);
    useEffect(() => {
        if(newMessage) {
            setMsgOneDay(msgOneDay?.concat(newMessage));
        }
    }, [newMessage]);
    return (
        <View
            style={{
                height: "auto",
                justifyContent: 'center',
            }}
        >
            <Text
                style={{
                    color: 'white',
                    paddingTop: 5,
                    paddingBottom: 5,
                    textAlign: 'center'
                }}
            >
                {dateToLongName(props.date)}
            </Text>
            <FlatList
                style={{
                    flex: 1,
                }}
                data={msgOneDay}
            ItemSeparatorComponent={() => <View style={{ paddingTop: "1.5%" }} />}
            renderItem={(item) => {
                return <Message
                    msgData={item.item}
                    />
            }}
            keyExtractor={(item) => item.timestamp.toString()}
        >
        </FlatList>
        </View>
    )
}
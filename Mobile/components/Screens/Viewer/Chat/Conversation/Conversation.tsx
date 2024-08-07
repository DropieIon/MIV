import { FlatList, View } from "react-native";
import { messageData, pfpsItem } from "../../../../../../Common/types";
import { groupBy } from 'lodash';
import { MessagesFromOneDay } from "./MessagesFromOneDay";

type propsTemplate = {
    messagesList: messageData[],
}

function groupByFunc(msg: messageData) {
    return new Date(msg.timestamp).toLocaleDateString("en-US");
}

export function Conversation(props: propsTemplate) {
    const groupedList = groupBy(props.messagesList, groupByFunc);
    let msgDates = Object.keys(groupedList).sort(
        (d1, d2) => {
            const getDateTime = (date: string): number => {
                const date_split = date.split('/');
                return new Date().setFullYear(parseInt(date_split[2]), parseInt(date_split[0]), parseInt(date_split[1]));
            }
            // there was a problem with parsing the dates,
            // returning NaN, so this is a workaround
            return getDateTime(d1) - getDateTime(d2);
        }
    );
    return (
        <View
            style={{
                top: '1%',
                height: '90%',
                width: '95%',
                left: '2.5%'
            }}
        >
            <FlatList
                data={msgDates}
                renderItem={(item) => {
                    return <MessagesFromOneDay
                        date={item.item}
                        messages={groupedList[item.item]?.sort((a, b) => {
                            if(a.timestamp > b.timestamp)
                                return 1;
                            return -1;
                        })}
                    />;
                }}
                ref={ref => this.flatList = ref}
                onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                // each date is unique
                keyExtractor={(item) => item}
            >
            </FlatList>
        </View>
    );
}
import { FlatList, View } from "react-native";
import { Message } from "./Message";


export function Conversation(props) {
    return (
        <View
            style={{
                backgroundColor: 'red',
                top: '1%',
                height: '90%',
                width: '95%',
                left: '2.5%'
            }}
        >
        <FlatList
            data={[{message: "daaaaaa"}]}
            renderItem={(item) => <Message message={item.item.message} />}
        >

        </FlatList>
        </View>
    );
}
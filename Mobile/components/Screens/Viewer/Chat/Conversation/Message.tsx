import { Text, View } from "react-native";

type propsTemplate = {
    message: string
}

export function Message(props: propsTemplate) {
    return (
        <View
            style={{
                backgroundColor: 'blue',
            }}
        >
            <View
                style={{
                    right: "2%",
                    backgroundColor: 'green',
                    alignItems: 'flex-end'
                }}
            >
                <Text
                  style={{
                    fontSize: 20,
                    padding: "2%",
                    borderRadius: 30,
                    backgroundColor: 'white'
                  }}  
                >
                    {props.message}
                </Text>
            </View>   
        </View>
    );
}
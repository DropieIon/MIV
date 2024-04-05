import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";


export function DetailsFooter(props) {
    return (
        <View
            style={{
                width: "100%",
                height: "20%",
                backgroundColor: 'yellow',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <TouchableOpacity
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: 'red'
                }}
                onPress={() => {
                    console.log("Chiar merge");
                    
                }}
            >
                <View
                    style={{
                        // backgroundColor: 'blue',
                        flex: 1,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}
                    >
                        Unassign
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
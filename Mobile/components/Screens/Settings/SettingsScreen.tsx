import { 
    SafeAreaView,
    Text,
    TouchableOpacity
} from "react-native";
import { useDispatch } from "react-redux";
import { setToken } from "../../../features/globalStateSlice";


export default function SettingsScreen(props) {
    const dispatch = useDispatch();
    return (
        <SafeAreaView
        style={{flex:1}}
        >
            <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%"}}
                onPress={() => dispatch(setToken(""))}
            >
                <Text>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
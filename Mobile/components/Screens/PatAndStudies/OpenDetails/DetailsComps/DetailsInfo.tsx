import {
    View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

export function DetailsInfo(props) {
    return (
        <View
            style={{
                flexDirection: 'row',
                height: "50%",
                backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <AntDesign
                name="user"
                size={24}
                color="white"
            />
            <Fontisto
                name="male"
                size={24}
                color="black" />
        </View>
    );
}
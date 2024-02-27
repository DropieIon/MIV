import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '@components/Templates/DefaultViewStyles';
import { TouchableOpacity} from 'react-native-gesture-handler';
import { parseJwt } from '../../../utils/helper';
import { propsTemplate } from './PropsTemplate';


export const assignListTemplate = (props: propsTemplate) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={ViewStyles.item}
        >
            <View
                style={{
                    width: "20%",
                    alignItems: 'center',
                }}
            >
                <Image
                    style={ViewStyles.item_img}
                    source={{ uri: `data:image/jpeg;base64,${props.item.profile_pic}` }} />
            </View>
            <Text
                style={[ViewStyles.item_name, { width: "60%" }]}
            >
                {props.item.full_name}
            </Text>
            <View
                style={{
                    width: "20%",
                }}
            >
                <TouchableOpacity
                    style={ViewStyles.item_assign_button}
                >
                    <Text
                    >
                        {parseJwt(props.token).isMedic === 'Y' ? "Assign" : "Request"}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
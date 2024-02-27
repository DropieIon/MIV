import React from 'react';
import {
    Text,
    View
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '@components/Templates/DefaultViewStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { propsTemplate } from './PropsTemplate';
import { AntDesign } from '@expo/vector-icons';
import { parseJwt } from '../../../utils/helper';
import { Asset, useAssets } from 'expo-asset';

export const patientReqTemplate = (props: propsTemplate) => {
    const medic = parseJwt(props.token)?.isMedic === 'Y';
    return (<TouchableOpacity
        activeOpacity={0.75}
        style={ViewStyles.item}
    >
        <View
            style={{
                width: "30%",
                alignItems: 'center',
            }}
        >
            <Image
                style={ViewStyles.item_img}
                source={{ uri: `data:image/jpeg;base64,${props.item.profile_pic}` }} />
        </View>
        <Text
            style={[ViewStyles.item_name, { width: "40%" }]}
        >
            {props.item.full_name}
        </Text>
        {medic &&
            <View
                style={{
                    width: "30%",
                    flexDirection: 'row'
                }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end'
                    }}
                >
                    <TouchableOpacity
                        style={[ViewStyles.item_assign_button, { backgroundColor: 'lightgreen' }]}
                    >
                        <AntDesign name="check" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        left: 10,
                        alignItems: 'flex-start'
                    }}
                >
                    <TouchableOpacity
                        style={[ViewStyles.item_assign_button, { backgroundColor: '#ff4c4c' }]}
                    >
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        }
        {!medic &&
            <View
                style={{
                    width: "30%"
                }}
            >
                {props.asset ? <Image
                style = {{
                    alignSelf: 'flex-end',
                    height: 50,
                    width: 115
                }}
                 source={props.asset[0]} /> : null}
            </View>
        }
    </TouchableOpacity>
    );
}
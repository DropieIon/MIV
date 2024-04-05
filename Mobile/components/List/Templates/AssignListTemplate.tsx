import React, { useState } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '@components/ListStyles';
import { TouchableOpacity} from 'react-native-gesture-handler';
import { parseJwt } from '../../../utils/helper';
import { propsTemplate } from './PropsTemplate';
import { answerReq, assignPatient, make_request } from '../../../dataRequests/AssignRequestsData';
import Toast from 'react-native-root-toast';

export const assignListTemplate = (props: propsTemplate) => {
    const medic = parseJwt(props.token).isMedic === 'Y';
    // const [successful, setSuccessful] = useState(false);
    // let toast = Toast.show('Request failed to send.', {
    //     duration: Toast.durations.LONG,
    //   });
    
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
                    onPress={() => {
                        // Request or assign to medic
                        const funcUsed = medic ? assignPatient : make_request;
                        funcUsed(props.token, props.item.username)
                        .then(() => {
                            // <Toast visible={true}>Thanks for subscribing!</Toast>
                            // It should always refresh after clicking request or assign
                            props.setRefreshList(Math.random());
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                    }}
                >
                    <Text
                    >
                        {medic ? "Assign" : "Request"}
                    </Text>
                </TouchableOpacity>
                {/* <Toast visible={true}>Thanks for subscribing!</Toast> */}
            </View>
        </TouchableOpacity>
    );
}
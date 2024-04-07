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
import { answerReq, assignPatient, makeRequest } from '../../../dataRequests/AssignRequestsData';
import Toast from 'react-native-root-toast';
import { defaultPfp } from '../../../configs/defaultUser.b64';

export const assignListTemplate = (props: propsTemplate) => {
    const medic = parseJwt(props.token).isMedic === 'Y';
    const noPfP = props.item.profile_pic === null;
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
                    source={{ uri: `data:image/jpeg;base64,${noPfP ? defaultPfp : props.item.profile_pic}` }} />
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
                        const funcUsed = medic ? assignPatient : makeRequest;
                        funcUsed(props.token, props.item.username)
                        .then(() => {
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
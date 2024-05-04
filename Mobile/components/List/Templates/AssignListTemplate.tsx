import React, { useState } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '../../../components/ListStyles';
import { TouchableOpacity} from 'react-native-gesture-handler';
import { parseJwt } from '../../../utils/helper';
import { propsTemplate } from './PropsTemplate';
import { answerReq, assignPatient, makeRequest } from '../../../dataRequests/AssignRequestsData';
import Toast from 'react-native-root-toast';
import { defaultPfp } from '../../../configs/defaultUser.b64';
import { setAccountDetails } from '../../../features/globalStateSlice';
import { ListEntry } from '../../../types/ListEntry';

export const assignListTemplate = (props: propsTemplate) => {
    const currentItem: ListEntry = props.item;
    const medic = parseJwt(props.token).role === 'med';
    const noPfP = props.item.profile_pic === null;
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={ViewStyles.item}
            onLongPress={() => {
                props.dispatch(setAccountDetails({
                    fullName: currentItem.full_name,
                    username: currentItem.username,
                    sex: currentItem.sex,
                    age: currentItem.age,
                    profile_pic: currentItem.profile_pic,
                    nrOfStudies: currentItem.nrOfStudies
                }))
                props.setOpenDetails(true);
            }}
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
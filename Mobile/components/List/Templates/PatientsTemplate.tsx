import React from 'react';
import {
    Text,
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '@components/ListStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { propsTemplate } from './PropsTemplate';
import { setPatDetails } from '../../../features/globalStateSlice';
import { ListEntry } from '../../../types/ListEntry';
import { defaultPfp } from '../../../configs/defaultUser.b64';

export function patientsTemplate(props: propsTemplate) {
    const currentItem: ListEntry = props.item;
    const noPfp = currentItem.profile_pic === null;
    return <TouchableOpacity
        style={ViewStyles.item}
        onLongPress={() => {
            props.dispatch(setPatDetails({
                fullName: currentItem.full_name,
                username: currentItem.username,
                sex: currentItem.sex,
                age: currentItem.age,
                profile_pic: currentItem.profile_pic,
                nrOfStudies: currentItem.nrOfStudies
            }))
            props.setOpenDetails(true);
        }}
        onPress={() => {
            props.navigation.navigate('Studies', {
                listStudies: true,
                patientID: props.item.uid,
            })
        }}
    >
        <Image
            style={ViewStyles.item_img}
            source={{ uri: `data:image/jpeg;base64,${noPfp ? defaultPfp : currentItem.profile_pic}` }} />
        <Text
            style={ViewStyles.item_name}
        >
            {props.item.full_name}
        </Text>
        <Text
            style={ViewStyles.item_age}
        >
            {props.item.age}
        </Text>
        <Text
            style={ViewStyles.item_sex}
        >
            {props.item.sex}
        </Text>
    </TouchableOpacity>
}
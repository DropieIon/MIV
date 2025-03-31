import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '../../../components/ListStyles';
import { propsTemplate } from './PropsTemplate';
import { setAccountDetails, setViewStudies } from '../../../features/globalStateSlice';
import { defaultPfp } from '../../../configs/defaultUser.b64';
import { MyDocsListEntry } from '../../../../Common/types';

export function MyDocsTemplate(props: propsTemplate) {
    const currentItem = (props.item as MyDocsListEntry);
    const noPfp = currentItem.pfp === null;
    const timeDiff = new Date().getTime() - new Date(currentItem.birthday).getTime()
    const age = Math.floor(Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365);
    return <TouchableOpacity
        style={ViewStyles.item}
        onLongPress={() => {
            props.dispatch(setAccountDetails({
                fullName: currentItem.fullName,
                sex: currentItem.sex,
                age: age,
                profile_pic: currentItem.pfp,
            }));
            props.setOpenDetails(true);
        }}
        onPress={() => {
        }}
    >
        <Image
            style={ViewStyles.item_img}
            source={{ uri: `data:image/jpeg;base64,${noPfp ? defaultPfp : currentItem.pfp}` }} />
        <Text
            style={[ViewStyles.item_name, {
                left: "20%",
                width: "80%",
                height: '100%'
            }]}
        >
            {currentItem.fullName}
        </Text>
    </TouchableOpacity>
}
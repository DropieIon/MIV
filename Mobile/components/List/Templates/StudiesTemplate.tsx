import React from 'react';
import {
    Text,
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '@components/ListStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { propsTemplate } from './PropsTemplate';


export const StudiesTemplate = (props: propsTemplate) => {
    return <TouchableOpacity
        style={ViewStyles.item}
        onLongPress={() => {
            props.setOpenDetails(true);
        }}
        onPress={() => props.dispatch(props.setOpenViewer({
            should_open: true,
            study_id: props.item.study_id,
            patient_username: props.item.patient_username
        }))}
    >
        <Image
            style={ViewStyles.item_img}
            source={{ uri: `data:image/jpeg;base64,${props.item.previewB64}` }}
            cachePolicy='memory'
        />
        <Text
            style={ViewStyles.item_name}
        >
            {props.item.modality}
        </Text>
        <Text
            style={ViewStyles.item_date}
        >
            {props.item.date === "//" ? "01/01/1970" : props.item.date}
        </Text>
    </TouchableOpacity>
}
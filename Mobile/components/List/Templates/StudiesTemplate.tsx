import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '../../../components/ListStyles';
import { propsTemplate } from './PropsTemplate';
import { setAccountDetails, setReq_study_id } from '../../../features/globalStateSlice';
import { ListEntry } from '../../../types/ListEntry';
import { parseJwt } from '../../../utils/helper';

export const StudiesTemplate = (props: propsTemplate) => {
    const unassignedStudies = props.viewStudiesType === 'unassigned';
    const currentItem: ListEntry = props.item;
    return <TouchableOpacity
        style={ViewStyles.item}
        activeOpacity={0.9}
        onLongPress={() => {
            props.dispatch(setAccountDetails({
                fullName: currentItem.modality,
                username: currentItem.study_id,
                profile_pic: currentItem.previewB64,
            }));
            props.setOpenDetails(true);
        }}
        onPress={() => {
            props.dispatch(props.setOpenViewer({
                should_open: true,
                study_id: props.item.study_id,
            }));
        }
        }
    >
        <Image
            style={ViewStyles.item_img}
            source={{ uri: `data:image/jpeg;base64,${props.item.previewB64}` }}
            cachePolicy='memory'
        />
        <Text
            style={[ViewStyles.item_name, { left: "15%" },
            unassignedStudies ? { width: "30%" } : {}]}
        >
            {props.item.modality}
        </Text>
        <Text
            style={[ViewStyles.item_date,
            unassignedStudies ? { width: "30%" } : {}]}
        >
            {props.item.date === "//" ? "01/01/1970" : props.item.date}
        </Text>
        {unassignedStudies ?
            <TouchableOpacity
                style={[ViewStyles.item_assign_button, { flex: 0.7 }]}
                onPress={() => {
                    // save the study_id so we can make the request
                    props.dispatch(setReq_study_id(props.item.study_id))
                    props.setOpenAssignment(true);
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Assign
                </Text>
            </TouchableOpacity>
            :
            <></>
        }
    </TouchableOpacity>
}
import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '../../../components/ListStyles';
import { propsTemplate } from './PropsTemplate';
import { setAccountDetails, setStudyChatUsername, setViewStudies } from '../../../features/globalStateSlice';
import { ListEntry } from '../../../types/ListEntry';
import { defaultPfp } from '../../../configs/defaultUser.b64';
import { assignToPatient } from '../../../dataRequests/PatientData';

export function patientsTemplate(props: propsTemplate) {
    const currentItem: ListEntry = props.item;
    const personalPatients = props.viewPatientsType === "personal";
    const noPfp = currentItem.profile_pic === null;
    const timeDiff = new Date().getTime() - new Date(currentItem.birthday).getTime()
    const age = Math.floor(Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365);
    return <TouchableOpacity
        style={ViewStyles.item}
        onLongPress={() => {
            if (personalPatients) {
                props.dispatch(setAccountDetails({
                    fullName: currentItem.full_name,
                    username: currentItem.username,
                    sex: currentItem.sex,
                    age: age,
                    profile_pic: currentItem.profile_pic,
                    nrOfStudies: currentItem.nrOfStudies
                }));
                props.setOpenDetails(true);
            }
        }}
        onPress={() => {
            if (personalPatients) {
                props.dispatch(setAccountDetails({
                    fullName: currentItem.full_name,
                    username: currentItem.username,
                    sex: currentItem.sex,
                    age: age,
                    profile_pic: currentItem.profile_pic,
                    nrOfStudies: currentItem.nrOfStudies
                }));
                props.dispatch(setStudyChatUsername(currentItem.username));
                props.dispatch(setViewStudies({
                    type: 'personal',
                    patientID: props.item.uid
                }));
                props.navigation.navigate('Studies', {
                    listStudies: true,
                    patientID: props.item.uid,
                });
            }
            else {
                assignToPatient(props.token, props.req_study_id, props.item.username)
                .then(() => {
                    props.setOpenAssignment(false);
                    props.setRefreshList(Math.random());
                    
                })
                .catch();
            }
        }}
    >
        <Image
            style={ViewStyles.item_img}
            source={{ uri: `data:image/jpeg;base64,${noPfp ? defaultPfp : currentItem.profile_pic}` }} />
        <Text
            style={[ViewStyles.item_name, { left: "15%" }, personalPatients ? {} : { color: 'white' }]}
        >
            {props.item.full_name}
        </Text>
        <Text
            style={[ViewStyles.item_age, personalPatients ? {} : { color: 'white' }]}
        >
            {age}
        </Text>
        <Text
            style={[ViewStyles.item_sex, personalPatients ? {} : { color: 'white' }]}
        >
            {props.item.sex}
        </Text>
    </TouchableOpacity>
}
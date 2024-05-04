import React from 'react';
import {
    Text,
    View
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '../../../components/ListStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { propsTemplate } from './PropsTemplate';
import { AntDesign } from '@expo/vector-icons';
import { parseJwt } from '../../../utils/helper';
import { answerReq } from '../../../dataRequests/AssignRequestsData';
import { defaultPfp } from '../../../configs/defaultUser.b64';
import { ListEntry } from '../../../types/ListEntry';
import { setAccountDetails } from '../../../features/globalStateSlice';

export const patientReqTemplate = (props: propsTemplate) => {
    const currentItem: ListEntry = props.item;
    const medic = parseJwt(props.token)?.role === 'med';
    const noPfp = props.item.profile_pic === null;
    return (<TouchableOpacity
        activeOpacity={0.75}
        style={ViewStyles.item}
        onLongPress={() => {
            props.dispatch(setAccountDetails({
                fullName: currentItem.full_name,
                username: medic ? currentItem.username : currentItem.doctor_username,
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
                width: "30%",
                alignItems: 'center',
            }}
        >
            <Image
                style={ViewStyles.item_img}
                source={{ uri: `data:image/jpeg;base64,${noPfp ? defaultPfp : props.item.profile_pic}` }} />
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
                        onPress={() => {
                            // after the request is answered we should trigger a refresh on the list
                            answerReq(props.token, props.item.patient_username, true)
                                .then(() => props.setRefreshList(Math.random()))
                        }}
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
                        onPress={() => {
                            answerReq(props.token, props.item.patient_username, false)
                                .then(() => props.setRefreshList(Math.random()))
                        }}
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
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import ViewStyles from '../Templates/DefaultViewStyles';
import { ListEntry } from '../../types/ListEntry';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setOpenViewer } from '../../features/globalStateSlice';
import { getPatientStudies } from '../../dataRequests/PatientData';

type propsTemplate = { 
    items: ListEntry[],
    listStudies: boolean,
    patient_username?: string
    navigation
}

const styles = StyleSheet.create({
    no_items_text: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: 'center'
    },
})

function List(props: propsTemplate) {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const medicTemplate = (item: ListEntry) => {
        return <TouchableOpacity
            style={ViewStyles.item}
            onPress={() => {
                getPatientStudies(item.uid, token)
                .then((study_list) => {
                    props.navigation.setOptions({ title: 'Studies' });
                    props.navigation.navigate('Patients', {
                        listStudies: true, 
                        items_list: study_list
                    })
                })
            }}
        >
            <Image
                style={ViewStyles.item_img}
                // TODO: change this pls
                source={{ uri: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII` }} />
            <Text
                    style={ViewStyles.item_name}
                >
                    {item.full_name}
                </Text>
                <Text
                    style={ViewStyles.item_age}
                >
                    {item.age}
                </Text>
                <Text
                    style={ViewStyles.item_sex}
                >
                    {item.sex}
                </Text>
        </TouchableOpacity>
    }
    const patientTemplate = (item: ListEntry) => {
        return <TouchableOpacity
            style={ViewStyles.item}
            onPress={() => dispatch(setOpenViewer({should_open: true, 
                study_id: item.study_id, patient_username: props.patient_username
            }))}
        >
            <Image
                style={ViewStyles.item_img}
                source={{ uri: `data:image/jpeg;base64,${item.previewB64}` }} 
                cachePolicy='memory'
                />
            <Text
                    style={ViewStyles.item_name}
                >
                    {item.modality}
                </Text>
                <Text
                    style={ViewStyles.item_date}
                >
                    {item.date}
                </Text>
        </TouchableOpacity>
    }
    let templateToUse = !props.listStudies ? medicTemplate : patientTemplate;
    let no_items = false;

    if (!props.items || props.items.length == 0) {
        no_items = true;
    }
    return (
        <View
            style={ViewStyles.list}
        >
            {no_items &&
                <Text
                    style={styles.no_items_text}
                >
                    No {props.listStudies ? 'studies' : 'patients'}
                </Text>
            }
            {!no_items &&
                <FlatList
                    ItemSeparatorComponent={() => <View style={{paddingTop: "5%"}} />}
                    keyExtractor={(item) =>  props.listStudies ? item.study_id : item.uid}
                    style={props.items.length == 0 ? { display: 'none' } : {}}
                    data={props.items}
                    renderItem={(item) => templateToUse(item.item)}
                >
                </FlatList>
            }
        </View>
    );
}

export default List;
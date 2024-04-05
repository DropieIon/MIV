import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import ViewStyles from '../ListStyles';
import { ListEntry } from '@types/ListEntry';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setOpenViewer } from '@features/globalStateSlice';
import { patientsTemplate } from './Templates/PatientsTemplate'
import { assignListTemplate } from './Templates/AssignListTemplate';
import { StudiesTemplate } from './Templates/StudiesTemplate';
import { patientReqTemplate } from './Templates/PatientReqTemplate';
import { useAssets } from 'expo-asset';

type propsTemplate = {
    items: ListEntry[],
    listStudies: boolean,
    template: string,
    setRefreshList?: any,
    // propagate the openModal state to
    // children
    setOpenDetails?,
    navigation
}

const styles = StyleSheet.create({
    no_items_text: {
        flex: 1,
        textAlign: "center",
    },
})

function List(props: propsTemplate) {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    let templateToUse, emptyString;
    let asset = null;
    switch (props.template) {
        case 'medic':
            emptyString = 'patients';
            templateToUse = patientsTemplate;
            break;
        case 'patient':
            emptyString = 'studies';
            templateToUse = StudiesTemplate;
            break;
        case 'assign':
            emptyString = 'items';
            templateToUse = assignListTemplate;
            break;
        case 'patientReq':
            emptyString = 'requests';
            [asset, ] = useAssets([require('@assets/images/pending.png')]);
            templateToUse = patientReqTemplate;
            break;
        default:
            console.error('Not a valid template')
            break;
    }
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
                    No {emptyString}
                </Text>
            }
            {!no_items &&
                <FlatList
                    ItemSeparatorComponent={() => <View style={{ paddingTop: "5%" }} />}
                    keyExtractor={(item) => props.listStudies ? item.study_id : item.uid}
                    style={props.items.length == 0 ? { display: 'none' } : {}}
                    data={props.items}
                    renderItem={(item) => templateToUse({
                        token: token,
                        item: item.item,
                        dispatch: dispatch,
                        setOpenViewer: setOpenViewer,
                        setRefreshList: props.setRefreshList,
                        setOpenDetails: props.setOpenDetails,
                        asset,
                        navigation: props.navigation
                    })}
                >
                </FlatList>
            }
        </View>
    );
}

export default List;
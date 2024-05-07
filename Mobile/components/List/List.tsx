import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import ViewStyles from '../ListStyles';
import { ListEntry } from '../../types/ListEntry';
import { useDispatch, useSelector } from 'react-redux';
import { selectReq_study_id, selectToken, selectViewStudies, setOpenViewer } from '../../features/globalStateSlice';
import { patientsTemplate } from './Templates/PatientsTemplate'
import { assignListTemplate } from './Templates/AssignListTemplate';
import { StudiesTemplate } from './Templates/StudiesTemplate';
import { patientReqTemplate } from './Templates/PatientReqTemplate';
import { useAssets } from 'expo-asset';

type propsTemplate = {
    items: ListEntry[],
    listStudies: boolean,
    template: string,
    viewPatientsType?: 'assign_study' | 'personal',
    setRefreshList?: any,
    // propagate the openModal state to
    // children
    setOpenDetails?,
    setOpenAssignment?,
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
    const viewStudies = useSelector(selectViewStudies);
    const req_study_id = useSelector(selectReq_study_id);
    const personalPatients = props.viewPatientsType === "personal";
    let templateToUse, emptyString, mainViewListStyle: any = ViewStyles.list;
    let asset = null;
    switch (props.template) {
        case 'medic':
            emptyString = 'patients';
            templateToUse = patientsTemplate;
            mainViewListStyle = [ViewStyles.list, 
                props.template === "medic" ? personalPatients ? {} : { top: "0%" } : {}]
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
            style={mainViewListStyle}
        >
            {no_items &&
                <Text
                    style={[styles.no_items_text, (props.template === "medic" && !personalPatients) ? { color: 'white' } : {}]}
                >
                    No {emptyString}
                </Text>
            }
            {!no_items &&
                <FlatList
                    ItemSeparatorComponent={() => <View style={{ paddingTop: "5%" }} />}
                    keyExtractor={(item) => props.listStudies ? item.uploaded : item.uid}
                    style={props.items.length == 0 ? { display: 'none' } : {}}
                    data={props.items}
                    renderItem={(item) => templateToUse({
                        token: token,
                        item: item.item,
                        viewStudiesType: viewStudies.type,
                        viewPatientsType: props.viewPatientsType,
                        dispatch: dispatch,
                        setOpenViewer: setOpenViewer,
                        setRefreshList: props.setRefreshList,
                        setOpenDetails: props.setOpenDetails,
                        setOpenAssignment: props.setOpenAssignment,
                        req_study_id: req_study_id,
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
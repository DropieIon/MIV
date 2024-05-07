import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
} from 'react-native';
import SearchBar from '../../Search/SearchBar';
import List from '../../List/List';
import { AddEntry } from './AddEntry/AddEntry';
import { ListEntry } from '../../../types/ListEntry';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectViewStudies, setRefreshList, setViewStudies } from '../../../features/globalStateSlice';
import { parseJwt } from '../../../utils/helper';
import { getStudies } from '../../../dataRequests/DicomData';
import { getPatientStudies } from '../../../dataRequests/PatientData';
import { OpenUpload } from './AddEntry/OpenUpload';
import Toast from 'react-native-root-toast';
import { AssignModal } from './AssignToPat/AssignModal';

const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: "100%",
        backgroundColor: '#2F80ED'
    },
    view_search: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        height: "10%",
        position: 'absolute'
    },
    view_list: {
        backgroundColor: "white",
        borderRadius: 50,
        top: "10%",
        height: "100%",
        width: "100%",
    }
});

type propsTemplate = {
    navigation,
    route: {
        params: {
            type: 'personal' | 'unassigned'
            listStudies: boolean,
            patientID: string,
        }
    }
}

function ViewStudies(props: propsTemplate) {
    const isVisible = useIsFocused();
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(true);
    const items_list = useRef<ListEntry[]>([]);
    const viewStudies = useSelector(selectViewStudies);
    const patientUid = viewStudies.patientID;
    const [openDetails, setOpenDetails] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    // this will store study_id
    const [openAssignment, setOpenAssignment] = useState(false);
    const [refreshStudList, setRefreshStudList] = useState(0);
    const medic = parseJwt(token)?.role === 'med';
    const unassignedStudies = viewStudies.type === "unassigned";
    const [err, setErr] = useState('');
    const [zipData, setZipData] = useState({
        uri: '',
        size: 0
    });
    useEffect(() => {
        if (zipData.size !== 0)
            setOpenUpload(true);
    }, [zipData]);
    useEffect(() => {
        // don't trigger unnecessary refreshes
        if (isVisible) {
            setLoading(true);
            const startTime = performance.now();
            const msToWait = 1500;
            if (token !== "") {
                if (!medic) {
                    getStudies(token, 'personal')
                        .then((data) => {
                            items_list.current = data.sort((e1, e2) => { return parseInt(e2.uploaded) - parseInt(e1.uploaded) });
                            const timeDiff = performance.now() - startTime;
                            if(timeDiff > msToWait)
                                setTimeout(() => setLoading(false), timeDiff);
                            else {
                                setLoading(false);
                            }
                        });
                } else {
                    let patID: string;
                    if (medic) {
                        if (unassignedStudies) {
                            getStudies(token, 'unassigned')
                                .then((studiesList) => {
                                    items_list.current = studiesList.sort((e1, e2) => { return parseInt(e2.uploaded) - parseInt(e1.uploaded) });;
                                    const timeDiff = performance.now() - startTime;
                                    if (timeDiff < msToWait)
                                        setTimeout(() => setLoading(false), timeDiff);
                                    else {
                                        setLoading(false);
                                    }
                                })
                        }
                        else {
                            if (patientUid === "" || (props.route.params && props.route.params.patientID !== patientUid)) {
                                dispatch(setViewStudies({
                                    type: 'personal',
                                    patientID: props.route.params.patientID
                                }));
                                patID = props.route.params.patientID;
                            }
                            else {
                                patID = patientUid;
                            }
                            getPatientStudies(patID, token)
                                .then((studiesList) => {
                                    items_list.current = studiesList.sort((e1, e2) => { return parseInt(e2.uploaded) - parseInt(e1.uploaded) });;
                                    const timeDiff = performance.now() - startTime;
                                    if (timeDiff < msToWait)
                                        setTimeout(() => setLoading(false), timeDiff);
                                    else {
                                        setLoading(false);
                                    }
                                })
                        }
                    }
                }
            }
            else {
                setErr("No token");
            }
            const handleBackButtonClick = () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
                if (medic)
                    props.navigation.navigate('Patients');
                return true;
            }
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        }
    }, [, isVisible, props.route.params, refreshStudList]);
    let filteredList = [];
    const [filter, setFilter] = useState("");
    if(filter !== "") {
        filteredList = items_list.current.filter((item) => {
            let toFilter = item.modality;
            return (new RegExp(`^${filter.toLowerCase().replace('\\', '')}`)).test(toFilter.toLowerCase());
        })
    }
    else {
        filteredList = items_list.current;
    }
    const opacityVal = 0.6;
    const shouldBlur = openDetails || openUpload || openAssignment;
    return <View
        style={styles.view}
    >
        <View
            style={[styles.view_search, shouldBlur ? {opacity: opacityVal} : {}]}
        >
            {/* Search, filter and patients View */}
            <SearchBar 
                onChange={(text) => {
                    setFilter(text);
                }}
            />
        </View>
        <View
            style={[styles.view_list, shouldBlur ? {opacity: opacityVal} : {}]}
        >
            {/*/ Patients / Studies list */}
            {loading &&
                <View
                    style={{
                        justifyContent: 'center',
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        Loading...
                    </Text>
                </View>
            }
            {!loading &&
                <List
                    template={'patient'}
                    navigation={props.navigation}
                    items={filteredList}
                    setOpenDetails={setOpenDetails}
                    setOpenAssignment={setOpenAssignment}
                    listStudies={true}
                ></List>
            }
        </View>
        {!loading && !openDetails && !openAssignment && openUpload &&
            <OpenUpload
                setErrUpload={setErr}
                setOpenUpload={setOpenUpload}
                zipUri={zipData.uri}
                zipSize={zipData.size}
            />}
        {viewStudies.type === "personal" ?
            <AddEntry
                type='Study'
                setZipData={setZipData}
                setErrUpload={setErr}
                navigation={props.navigation}
            />
            :
            <></>
        }
        <Toast
            visible={err !== ''}
            onShow={() => {
                setTimeout(() => {
                    setErr('');
                }, 2000);
            }}
        >
            {err}
        </Toast>
        {!loading && !openDetails && !openUpload && openAssignment &&
            <AssignModal
                setRefreshList={setRefreshStudList}
                setOpenAssignment={setOpenAssignment}
            />
        }
    </View>
}

export default ViewStudies;
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import SearchBar from '../../Search/SearchBar';
import List from '../../List/List';
import ViewStyles from '@components/ListStyles';
import { AddEntry } from '../../Patient/AddEntry';
import { ListEntry } from '../../../types/ListEntry';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectPatientUid, selectToken, setPatientUid } from '../../../features/globalStateSlice';
import { parseJwt } from '../../../utils/helper';
import { getStudies } from '../../../dataRequests/DicomData';
import { getPatientStudies } from '../../../dataRequests/PatientData';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';


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
            listStudies: boolean,
            patientID: string
        }
    }
}

function ViewStudies(props: propsTemplate) {
    const isVisible = useIsFocused();
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(true);
    const items_list = useRef<ListEntry[]>([]);
    const patientUid = useSelector(selectPatientUid);
    const [openDetails, setOpenDetails] = useState(false);
    const medic = parseJwt(token)?.isMedic === 'Y';
    useEffect(() => {
        // don't trigger unnecessary refreshes
        if (isVisible) {
            setLoading(true);
            const startTime = performance.now();
            const msToWait = 1500;
            if (token !== "") {
                if (!medic) {
                    getStudies(token)
                        .then((data) => {
                            items_list.current = data;
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
                        if (patientUid === "" || (props.route.params && props.route.params.patientID !== patientUid)) {
                            dispatch(setPatientUid(props.route.params.patientID));
                            patID = props.route.params.patientID;
                        }
                        else {
                            patID = patientUid;
                        }
                    }
                    getPatientStudies(patID, token)
                    .then((studiesList) => {
                        items_list.current = studiesList;
                        const timeDiff = performance.now() - startTime;
                            if(timeDiff < msToWait)
                                setTimeout(() => setLoading(false), timeDiff);
                            else {
                                setLoading(false);
                            }
                    })
                }
            }
            else {
                console.error("No token");
            }
            const handleBackButtonClick = () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
                if (medic)
                    props.navigation.navigate('Patients');
                return true;
            }
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        }
    }, [, isVisible]);
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
    return <View
        style={styles.view}
    >
        <View
            style={[styles.view_search, openDetails ? {opacity: opacityVal} : {}]}
        >
            {/* Search, filter and patients View */}
            <SearchBar 
                onChange={(text) => {
                    setFilter(text);
                }}
            />
        </View>
        <View
            style={[styles.view_list, openDetails ? {opacity: opacityVal} : {}]}
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
                    listStudies={true}
                ></List>
            }
        </View>
        {/* {!loading && openDetails &&
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => {

                }}>
                <View
                    style={{
                        height: "30%",
                        top: "70%",
                        backgroundColor: 'red',
                        borderTopEndRadius: 50,
                        borderTopStartRadius: 50
                    }}
                >
                    <View
                        // this is the header
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Image
                            style={[ViewStyles.item_img, { width: "20%" }]}
                            // TODO: change this please
                            source={{ uri: `data:image/jpeg;base64,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` }} />
                        <Text
                            style={{
                                width: "80%",
                                height: 75,
                                textAlign: 'center',
                                color: 'white',
                                fontSize: 34,
                                textAlignVertical: 'center',
                                left: "20%"
                            }}
                        >
                            Verilog VHDL
                        </Text>
                    </View>
                    <View
                        // these are the details
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <AntDesign name="user" size={24} color="white" />
                        <Fontisto name="male" size={24} color="black" />
                    </View>
                    <TouchableOpacity
                        // this is the footer
                        style={{
                            top: "90%",
                            position: 'absolute',
                            width: "100%",
                            height: "10%"
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'blue',
                                flex: 1,
                                justifyContent: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                }}
                            >
                                Unassign
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        } */}
        <AddEntry/>
    </View>
}

export default ViewStudies;
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import SearchBar from '../../Search/SearchBar';
import List from '../../List/List';
import { AddEntry } from '../../Patient/AddEntry';
import { ListEntry } from '../../../types/ListEntry';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../features/globalStateSlice';
import { parseJwt } from '../../../utils/helper';
import { getStudies } from '../../../dataRequests/DicomData';
import { getPatients } from '../../../dataRequests/PatientData';
import { DetailsModal } from './OpenDetails/DetailsModal';

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
        }
    }
}

function ViewPatients(props: propsTemplate) {
    const {
        listStudies,
    } = props.route.params;
    const isVisible = useIsFocused();
    const token = useSelector(selectToken);
    const [openDetails, setOpenDetails] = useState(false);
    const [refreshPatList, setRefreshPatList] = useState(0);
    const [loading, setLoading] = useState(true);
    const items_list = useRef<ListEntry[]>([]);
    useEffect(() => {
        
        // don't trigger unnecessary refreshes
        if (isVisible) {
            setLoading(true);
            if (token !== "") {
                if (parseJwt(token).isMedic === 'N') {
                    getStudies(token)
                        .then((data) => {
                            items_list.current = data;
                            setLoading(false);
                            console.log("loaded at:", (new Date()).toLocaleTimeString());

                        });
                } else {
                    // it's a doctor that views his patients
                    getPatients(token)
                        .then((patients) => {
                            items_list.current = patients;
                            setLoading(false);
                        });
                }
            }
            else {
                console.error("No token");
            }
        }
    }, [, isVisible, refreshPatList]);
    let filteredList;
    const [filter, setFilter] = useState("");
    if(filter !== "") {
        filteredList = items_list.current.filter((item) => {
            let toFilter;
            if(listStudies)
                toFilter = item.modality;
            else
                toFilter = item.full_name;
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
            {/* {!listStudies && <FilterAge />}
            {!listStudies && <FilterSex />}
            {listStudies && <FilterDate/>} */}
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
                    template={listStudies ? 'patient' : 'medic'}
                    navigation={props.navigation}
                    items={filteredList}
                    setOpenDetails={setOpenDetails}
                    listStudies={listStudies}
                ></List>
            }
        </View>
        {!loading && openDetails &&
            <DetailsModal
                setOpenDetails={setOpenDetails}
                setRefreshPatList={setRefreshPatList}
            />
        }
        <AddEntry/>
    </View>
}

export default ViewPatients;
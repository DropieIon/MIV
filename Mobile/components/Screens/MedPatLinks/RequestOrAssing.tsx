import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import SearchBar from '../../Search/SearchBar';
import List from '../../List/List';
import { ListEntry, accountDataListEntry } from '../../../types/ListEntry';
import { getDoctors } from '../../../dataRequests/DoctorData';
import { selectToken } from '../../../features/globalStateSlice';
import { useSelector } from 'react-redux';
import { parseJwt } from '../../../utils/helper';
import { getAllPatients } from '../../../dataRequests/AssignRequestsData';
import { useIsFocused } from "@react-navigation/native";
import { DetailsModal } from '../PatAndStudies/OpenDetails/DetailsModal';

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
}

export function RequestOrAssign(props: propsTemplate) {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const itemsList = useRef<(ListEntry | accountDataListEntry)[]>(null);
    let filteredList: ListEntry[] = null;
    const token = useSelector(selectToken);
    let [refreshList, setRefreshList] = useState(0);
    const isVisible = useIsFocused();
    const [openDetails, setOpenDetails] = useState(false);

    useEffect(() => {
        // don't trigger unnecessary refreshes
        if(isVisible)
        {
            setLoading(true);
            const isMedic = parseJwt(token)?.isMedic === 'Y';
            if(isMedic) {
                getAllPatients(token).then((data) => {
                    itemsList.current = data;
                    setLoading(false);
                })
            }
            else {
                getDoctors(token).then((data) => {
                    itemsList.current = data;
                    setLoading(false);
                });
            }
        }
    }, [, isVisible, refreshList]);
    if(filter !== "") {
        filteredList = itemsList.current.filter((item) => {
            return (new RegExp(`^${filter.toLowerCase().replace('\\', '')}`)).test(item.full_name.toLowerCase());
        })
    }
    else {
        filteredList = itemsList.current;
    }
    const opacityVal = 0.6;
    return (
        <View
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
                    <Text
                        style={{
                            flex: 1,
                            paddingTop: 10,
                            textAlign: "center",
                        }}
                    >
                        Loading...
                    </Text>
                }
                {!loading &&
                    <List
                        template='assign'
                        navigation={props.navigation}
                        setRefreshList={setRefreshList}
                        setOpenDetails={setOpenDetails}
                        items={filteredList}
                        listStudies={false}
                    />
                }
            </View>
            {!loading && openDetails &&
            <DetailsModal
                setOpenDetails={setOpenDetails}
                setRefreshPatList={setRefreshList}
                type='AllPats'
            />
        }
        </View>
    );
}
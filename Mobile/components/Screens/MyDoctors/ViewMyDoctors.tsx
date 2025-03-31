import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import SearchBar from '../../Search/SearchBar';
import List from '../../List/List';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../features/globalStateSlice';
import { DetailsModal } from '../PatAndStudies/OpenDetails/DetailsModal';
import { getMyDocs } from '../../../dataRequests/DoctorData';
import { MyDocsListEntry } from '../../../../Common/types';

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
        params
    }
}

function ViewMyDoctors(props: propsTemplate) {
    const isVisible = useIsFocused();
    const token = useSelector(selectToken);
    const [openDetails, setOpenDetails] = useState(false);
    const [refreshDoc, setRefreshDocList] = useState(0);
    const [loading, setLoading] = useState(true);
    const items_list = useRef<MyDocsListEntry[]>([]);
    useEffect(() => {
        // don't trigger unnecessary refreshes
        if (isVisible) {
            setLoading(true);
            if (token !== "") {
                getMyDocs(token)
                .then((data) => {
                    items_list.current = data;
                    setLoading(false);
                })
            }
            else {
                console.error("No token");
            }
        }
    }, [, isVisible, refreshDoc]);
    let filteredList;
    const [filter, setFilter] = useState("");
    if(filter !== "") {
        filteredList = items_list.current.filter((item) => {
            return (new RegExp(`^${filter.toLowerCase().replace('\\', '')}`)).test(item.fullName.toLowerCase());
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
            {/*/ MyDocs list */}
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
                    template={'mydocs'}
                    navigation={props.navigation}
                    items={filteredList}
                    setOpenDetails={setOpenDetails}
                    viewPatientsType={'personal'}
                    listStudies={false}
                ></List>
            }
        </View>
        {!loading && openDetails &&
            <DetailsModal
                setOpenDetails={setOpenDetails}
                setRefreshPatList={setRefreshDocList}
                type='MyDocs'
            />
        }
    </View>
}

export default ViewMyDoctors;
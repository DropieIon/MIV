import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { getRequests } from '../../../dataRequests/AssignRequestsData';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../features/globalStateSlice';
import { requestsListEntry } from '../../../types/ListEntry';
import List from '../../List/List';
import SearchBar from '../../Search/SearchBar';
import { useIsFocused } from '@react-navigation/native';

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

export function MedicRequests(props: propsTemplate) {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const itemsList = useRef<requestsListEntry[]>(null);
    let filteredList: requestsListEntry[] = null;
    const token = useSelector(selectToken);
    let [refreshList, setRefreshList] = useState(0);
    const isVisible = useIsFocused();
    useEffect(() => {
        // don't trigger unnecessary refreshes
        if(isVisible)
        {
            setLoading(true);
            getRequests(token).then((data) => {
                itemsList.current = data;
                setLoading(false);
            });
        }
    }, [, isVisible, refreshList]);
    if (filter !== "") {
        filteredList = itemsList.current.filter((item) => {
            return (new RegExp(`^${filter.toLowerCase().replace('\\', '')}`)).test(item.full_name.toLowerCase());
        })
    }
    else {
        filteredList = itemsList.current;
    }
    return (
        <View
            style={styles.view}
        >
            <View
                style={styles.view_search}
            >
                {/* Search, filter and patients View */}
                <SearchBar
                    onChange={(text) => {
                        setFilter(text);
                    }}
                />
            </View>
            <View
                style={styles.view_list}
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
                        template='patientReq'
                        navigation={props.navigation}
                        items={filteredList}
                        setRefreshList={setRefreshList}
                        listStudies={false}
                    />
                }
            </View>
        </View>
    );
}
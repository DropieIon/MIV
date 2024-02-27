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
    // route: {
    //     params: {
    //         listStudies: boolean,
    //         items_list: (ListEntry)[],
    //     }
    // }
}

export function RequestOrAssign(props: propsTemplate) {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const itemsList = useRef<(ListEntry | accountDataListEntry)[]>(null);
    let filteredList: ListEntry[] = null;
    const token = useSelector(selectToken);
    useEffect(() => {
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
    }, []);
    if(filter !== "") {
        filteredList = itemsList.current.filter((item) => {
            return (new RegExp(`^${filter.toLowerCase()}`)).test(item.full_name.toLowerCase());
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
                        template='assign'
                        navigation={props.navigation}
                        items={filteredList}
                        listStudies={false}
                    />
                }
            </View>
        </View>
    );
}
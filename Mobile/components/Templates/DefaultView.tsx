import React, { useState } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import SearchBar from '../Search/SearchBar';
import List from '../List/List';
import { AddEntry } from '../Patient/AddEntry';
import { ListEntry } from '../../types/ListEntry';

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
            items_list: (ListEntry)[],
        }
    }
}

function DefaultView(props: propsTemplate) {
    const {
        listStudies, 
        items_list,
    } = props.route.params;
    let filteredList;
    const [filter, setFilter] = useState("");
    if(filter !== "") {
        filteredList = items_list.filter((item) => {
            let toFilter;
            if(listStudies)
                toFilter = item.modality;
            else
                toFilter = item.full_name;
            return (new RegExp(`^${filter.toLowerCase().replace('\\', '')}`)).test(toFilter.toLowerCase());
        })
    }
    else {
        filteredList = items_list;
    }
    return <View
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
            {/* {!listStudies && <FilterAge />}
            {!listStudies && <FilterSex />}
            {listStudies && <FilterDate/>} */}
        </View>
        <View
            style={styles.view_list}
        >
            {/*/ Patients / Studies list */}
            <List
                template={listStudies ? 'patient' : 'medic'}
                navigation={props.navigation}
                items={filteredList}
                listStudies={listStudies}
            ></List>
        </View>
        <AddEntry/>
    </View>
}

export default DefaultView;
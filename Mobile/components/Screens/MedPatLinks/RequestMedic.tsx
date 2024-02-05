import React, { useState } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import SearchBar from '../../Search/SearchBar';

const styles = StyleSheet.create({

});

export function RequestMedic(props) {
    const [filter, setFilter] = useState("");
    let filteredList;
    if(filter !== "") {
        filteredList = items_list.filter((item) => {
            let toFilter;
            if(listStudies)
                toFilter = item.modality;
            else
                toFilter = item.full_name;
            return (new RegExp(`^${filter.toLowerCase()}`)).test(toFilter.toLowerCase());
        })
    }
    else {
        filteredList = items_list;
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
            {/* {!listStudies && <FilterAge />}
            {!listStudies && <FilterSex />}
            {listStudies && <FilterDate/>} */}
        </View>
        <View
            style={styles.view_list}
        >
            {/*/ Patients / Studies list */}
            <List
                navigation={props.navigation}
                items={filteredList}
                listStudies={listStudies}
            ></List>
        </View>
        <AddEntry/>
    </View>
    );
}
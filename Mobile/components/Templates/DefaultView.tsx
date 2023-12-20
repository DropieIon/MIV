import React, { Component, useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import SearchBar from '../Search/SearchBar';
import FilterAge from '../Doctor/FilterAge';
import FilterSex from '../Doctor/FilterSex';
import List from '../List/List';
import FilterDate from '../Patient/FilterDate';
import { AddEntry } from '../Patient/AddEntry';

const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: "100%",
    },
    view_search: {
        flex: 2.8,
        width: "100%",
        // backgroundColor: "blue",
    },
    view_list: {
        flex: 30,
        width: "100%",
        // backgroundColor: "green"
    }
});

function DefaultView(props: { isMedic: boolean}) {
    return <View
        style={styles.view}
    >
        <View
            style={styles.view_search}
        >
            {/* Search, filter and patients View */}
            <SearchBar />
            {props.isMedic && <FilterAge />}
            {props.isMedic && <FilterSex />}
            {!props.isMedic && <FilterDate/>}
            <AddEntry/>
        </View>
        <View
            style={styles.view_list}
        >
            {/*/ Patients / Studies list */}
            <List
                items={[{uuid: "1", name: "test", date: '1/12/2023'}, {uuid: "2", name: "test", date: '1/12/2023'}, {uuid: "3", name: "test", date: '1/12/2023'}]}
                isMedic={props.isMedic}
            // items={[]}
            ></List>
        </View>

    </View>
}

export default DefaultView;
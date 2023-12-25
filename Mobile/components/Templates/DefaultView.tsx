import React, { Component, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
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

type propsTemplate = {
    route: {
        params: {
            isMedic: boolean,
            studies_list: string[],
            loading: boolean
        }
    }
}

function DefaultView(props: propsTemplate) {
    let list_of_studies = [];
    const {
        isMedic, 
        studies_list,
        loading
    } = props.route.params;
    studies_list?.forEach((value) => {
        list_of_studies.push({uid: value, name: value, date: '1/1/2024'})
    })
    return <View
        style={styles.view}
    >
        <View
            style={styles.view_search}
        >
            {/* Search, filter and patients View */}
            <SearchBar />
            {isMedic && <FilterAge />}
            {isMedic && <FilterSex />}
            {!isMedic && <FilterDate/>}
            <AddEntry/>
        </View>
        <View
            style={styles.view_list}
        >
            {/*/ Patients / Studies list */}
            <List
                loading={loading}
                items={list_of_studies}
                isMedic={isMedic}
            // items={[]}
            ></List>
        </View>

    </View>
}

export default DefaultView;
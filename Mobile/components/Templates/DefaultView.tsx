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
import { studiesListEntry } from '../../dataRequests/OrthancData';

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
            studies_list: studiesListEntry[],
        }
    }
}

function DefaultView(props: propsTemplate) {
    const {
        isMedic, 
        studies_list,
    } = props.route.params;
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
                items={studies_list}
                isMedic={isMedic}
            ></List>
        </View>

    </View>
}

export default DefaultView;
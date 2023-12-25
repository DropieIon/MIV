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
import { getStudies } from '../../dataRequests/OrthancData';
import { useSelector } from 'react-redux';
import { selectToken } from '../../features/globalStateSlice';

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
    const token = useSelector(selectToken);
    let studies_uid_list = useRef<string[]>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if(token)
        {
            // TODO: get this for the current patient
            getStudies("8e9e8135-f9e05d3e-aa128825-97883040-ec6c49a5", token)
                .then((data) => {
                    studies_uid_list.current = data;
                    setLoading(false);
                })
        }
    }, [])
    let list_of_studies = [];
    studies_uid_list.current?.forEach((value) => {
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
                loading={loading}
                items={list_of_studies}
                isMedic={props.isMedic}
            // items={[]}
            ></List>
        </View>

    </View>
}

export default DefaultView;
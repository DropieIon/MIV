import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectFullName,
    selectToken,
    selectTokenRefreshRef,
    setRefreshList,
    setToken,
    setTokenRefreshRef
} from '../features/globalStateSlice';
import { parseJwt } from '../utils/helper';

export function CustomDrawer(props) {
    const token = useSelector(selectToken);
    const tokenRefreshRef = useSelector(selectTokenRefreshRef);
    const fullName_split = useSelector(selectFullName).split(' ');
    const dispatch = useDispatch();

    const medic = parseJwt(token)?.isMedic === 'Y';
    const studOrPatients = medic ? 'Patients' : 'Studies';
    const allPatsOrMeds = medic ? 'All Patients' : 'All Doctors';
    const reqTxt = (medic ? '' : 'My ') + 'Requests';

    const fname = fullName_split[0];
    const lname = fullName_split[1];
    return (
        <View style={styles.container}>
            <View style={styles.drawHead}>
                <Text style={styles.name}>
                    {fname} {lname}
                </Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={styles.s}>
                <DrawerItem label={studOrPatients} 
                    onPress={() => {
                        props.navigation.navigate(studOrPatients);
                    }} />
                <DrawerItem label={allPatsOrMeds}
                    onPress={() => {
                        props.navigation.navigate(allPatsOrMeds);
                    }} />
                <DrawerItem label={reqTxt} 
                    onPress={() => {
                        props.navigation.navigate(reqTxt);
                    }} />
                <DrawerItem label={'Settings'} 
                    onPress={() => props.navigation.navigate('Settings')} />
                <DrawerItem label={'Log Out'} 
                    onPress={() => {
                        dispatch(setToken(''));
                        clearTimeout(tokenRefreshRef);
                        dispatch(setTokenRefreshRef(null));
                    }} />
            </DrawerContentScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawHead: {
        display: 'flex',
        height: 180,
        backgroundColor: 'black',
        marginBottom: 20,
        paddingStart: 20,
        paddingTop: '22%',
    },
    name: {
        fontSize: 24,
        color: 'white'
    },
    s: {
        flex: 1,
        paddingStart: 10,
    },
    footLogo: {
        width: 60,
        height: 35,
        marginStart: 20,
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
        resizeMode: 'contain',
    }
});

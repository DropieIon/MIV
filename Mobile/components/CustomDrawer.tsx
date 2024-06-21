import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCurrentAccountFullName,
    selectMyPfp,
    selectToken,
    selectTokenRefreshRef,
    setMyPfp,
    setToken,
    setTokenRefreshRef,
    setViewStudies
} from '../features/globalStateSlice';
import { parseJwt } from '../utils/helper';
import { Image } from 'expo-image';
import { defaultPfp } from '../configs/defaultUser.b64';

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
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    name: {
        fontSize: 24,
        left: "5%",
        color: 'white',
        position: 'absolute',
        zIndex: 3
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


export function CustomDrawer(props) {
    const token = useSelector(selectToken);
    const tokenRefreshRef = useSelector(selectTokenRefreshRef);
    const fullName_split = useSelector(selectCurrentAccountFullName).split(' ');
    const myPfp = useSelector(selectMyPfp);
    const dispatch = useDispatch();

    const jwtBody = parseJwt(token);
    const medic = jwtBody?.role === 'med';
    const admin = jwtBody?.role === "admin";
    const studOrPatients = medic ? 'Patients' : 'Studies';
    const allPatsOrMeds = admin ? 'All Patients' : medic ? 'All Patients' : 'All Doctors';
    const reqTxt = (medic ? '' : 'My ') + 'Requests';

    const fname: string = fullName_split[0];
    const lname: string = fullName_split[1];
    return (
        <View style={styles.container}>
            <View style={styles.drawHead}>
                <Image
                    style={{ width: 180, height: 180 }}
                    source={{ uri: `data:image/jpeg;base64,${myPfp}` }}
                    contentFit='contain'
                >
                </Image>
                <Text style={styles.name}>
                    {fname} {lname}
                </Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={styles.s}>
                {admin ?
                    <></>
                    :
                    <DrawerItem label={studOrPatients}
                        onPress={() => {
                            if (studOrPatients === "Studies") {
                                dispatch(setViewStudies({
                                    type: 'personal',
                                    patientID: ""
                                }));
                                props.navigation.navigate(studOrPatients);
                            }
                            else {
                                // it's about patients
                                props.navigation.navigate(studOrPatients, {
                                    viewPatientsType: 'personal'
                                });
                            }
                        }} />}
                <DrawerItem label={allPatsOrMeds}
                    onPress={() => {
                        props.navigation.navigate(allPatsOrMeds);
                    }} />
                {admin &&
                    <DrawerItem label={'All Docs'}
                        onPress={() => {
                            props.navigation.navigate('All Docs');
                        }} />
                }
                {(!admin && medic) ?
                    <DrawerItem label={"Unassigned Studies"}
                        onPress={() => {
                            dispatch(setViewStudies({
                                type: 'unassigned',
                                patientID: ""
                            }));
                            props.navigation.navigate("Studies", {
                                type: 'unassigned'
                            })
                        }}
                    />
                    :
                    <></>
                }
                {(!admin && !medic) ?
                    <DrawerItem label={"My Doctors"}
                        onPress={() => {
                            props.navigation.navigate("My Doctors");
                        }}
                    />
                    :
                    <></>
                }
                {admin ?
                    <></>
                    :
                    <DrawerItem label={reqTxt}
                        onPress={() => {
                            props.navigation.navigate(reqTxt);
                        }} />}
                <DrawerItem label={'Settings'}
                    onPress={() => props.navigation.navigate('Settings')} />
                <DrawerItem label={'Log Out'}
                    onPress={() => {
                        dispatch(setToken(''));
                        clearTimeout(tokenRefreshRef);
                        dispatch(setTokenRefreshRef(null));
                        dispatch(setMyPfp(""));
                        dispatch(setViewStudies({
                            type: 'personal',
                            patientID: ""
                        }));
                    }} />
            </DrawerContentScrollView>
        </View>
    )
}


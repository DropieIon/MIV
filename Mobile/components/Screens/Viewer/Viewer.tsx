import React, { Component, useState } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    BackHandler
} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { getViewerImages, getAllPatients } from '../../Data';
import { useDispatch } from 'react-redux';
import { setOpenViewer } from '../../../features/globalStateSlice';

const styles = StyleSheet.create({
    main_screen: {
        backgroundColor: 'black',
        flex: 1
    }
})


export function Viewer(props) {
    const [loading, setLoading] = useState(true);
    const [all_data, setAll_Data] = useState([]);
    let images: React.JSX.Element[] = [];
    let key_id = 0;
    const dispatch = useDispatch();
    const handleBackButtonClick = () => {
        dispatch(setOpenViewer(false));
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        return true;
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    if (!loading) {
        images = all_data.map((data) => {
            return <Image key={key_id++} style={{ width: 200, height: 200 }} source={{ uri: `data:image/jpeg;base64,${data}` }}></Image>
        })
    }
    return (
        <SafeAreaView
            style={styles.main_screen}
        >
            {images}

        </SafeAreaView>
    );
}
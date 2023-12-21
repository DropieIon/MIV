import React, { Component, useEffect, useRef, useState } from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
    BackHandler
} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { getViewerImages, getAllPatients } from '../../Data';
import { useDispatch } from 'react-redux';
import { setOpenViewer } from '../../../features/globalStateSlice';
import { imageListItem } from '../../../types/ListEntry';
import { ViewerImage } from './ViewerImage';

const styles = StyleSheet.create({
    main_screen: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center'
    },
    scroll_list: { 
        height: "100%",
        width: "100%",
        opacity: 0,
        position: 'absolute',
        zIndex: 1
    }
})


export function Viewer(props) {
    const [loading, setLoading] = useState(true);
    const [all_data, setAll_Data] = useState<imageListItem[]>([]);
    let index = 0;
    let nr_ref = useRef<FlatList>(null);
    useEffect(() => {
        getAllPatients().then((data) => getViewerImages(data[0]).then((data) => {
            setAll_Data(data);
            setLoading(false);
        }));
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    }, []);

    const dispatch = useDispatch();
    const handleBackButtonClick = () => {
        dispatch(setOpenViewer(false));
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        return true;
    }
    let currentOffset = 0;
    let img_nr = null, setImg_nr = null;
    
    return (
        <SafeAreaView
            style={styles.main_screen}
        >
            {loading && <Text style={{ textAlign: 'center' }}>Loading</Text>}
                {!loading &&
                    <ViewerImage
                        all_data={all_data}
                        onMount={(childData) => {
                            img_nr = childData[0];
                            setImg_nr = childData[1];
                        }}
                    />
                }
                {! loading && 
                    <FlatList
                        data={Array.from(Array(30).keys())}
                        keyExtractor={(item) => item.valueOf()}
                        renderItem={(item) => {
                            return <Text style={{height: 100, width: 100}}>{item.item}</Text>
                        }}
                        showsVerticalScrollIndicator={false}
                        ref={nr_ref}
                        style={styles.scroll_list}
                        onScrollEndDrag={(e) => {
                            nr_ref.current?.scrollToIndex({ index: 15, animated: false })
                        }}
                        scrollEventThrottle={100}
                        onScroll={(e) => {
                            const offset = e.nativeEvent.contentOffset.y
                            if (currentOffset > offset) {
                                index -= (index === 0 ? 0 : 1)
                            } else if (currentOffset < offset) {
                                index += (index === 100 - 1 ? 0 : 1);
                            }
                            setImg_nr(Math.round(index/100 * (all_data.length - 1)));
                            currentOffset = offset;
                        }}

                />}

        </SafeAreaView>
    );
}
import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    View,
    SafeAreaView,
    BackHandler,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { getViewerImages } from '../../../dataRequests/DicomData';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setLoadingProgress, setOpenViewer } from '../../../features/globalStateSlice';
import { Image } from 'expo-image';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { MainImageView } from './MainImageView';
import { imageListItem } from '../../../types/ListEntry';
import { LoadingSeriesBar } from './LoadingSeriesBar';

const styles = StyleSheet.create({
    main_screen: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center'
    },
    close_button: {
        position: 'absolute',
        flex: 1,
        right: "2%"
    },
    series_list: {
        position: 'absolute',
        top: "7%",
        width: "100%",
        height: "15%"
    },
    drawer_header: {
        top: "3%",
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
    },
    loading_text_view: {
        flex: 1,
        justifyContent: 'center',
    },
    loading_text: {
        textAlign: 'center',
        color: 'white'
    }
})

const Drawer = createDrawerNavigator();

export function Viewer(props: { study_id: string}) {
    function SeriesView({ navigation }: DrawerContentComponentProps) {
        return (
            <View
                style={{ flex: 1}}
            >
                <Text
                    style={styles.drawer_header}
                >
                    Series
                </Text>
                <FlatList
                    style={[styles.series_list, {height: "90%"}]}
                    data={loading_data.current}
                    showsHorizontalScrollIndicator={false}
                    renderItem={(item) => {
                        return (
                            <TouchableOpacity
                                style={{alignItems: 'center'}}
                                onPress={(e) => {
                                    navigation.navigate('MainImage', {
                                        length: series_lengths[item.index],
                                        seriesData: loading_data.current[item.index]
                                    });
                                }}
                            >
                                <LoadingSeriesBar
                                    index={item.index}
                                    length={series_lengths[item.index]}
                                />
                                <Image
                                    style={{ height: 200, width: 200 }}
                                    source={{ uri: `data:image/png;base64,${item.item[
                                        Math.round(item.item.length === 1? 0 : item.item.length / 2)
                                    ]?.data}` }}
                                />
                            </TouchableOpacity>
                        )
                    }
                    } />
            </View>
        );
    }
    const [progress, setProgress] = useState(0);
    const loading= useRef(true);
    // We use these refs so we can have peristent data between renders
    const loading_data = useRef<imageListItem[][]>([]);
    const [series_lengths, setSeries_lengths] = useState<number[]>([]);
    const token = useSelector(selectToken);
    useEffect(() => {
        const functions = {
            dispatch: dispatch, 
            setLoadingProgress: setLoadingProgress,
            setProgress
        }
        
        getViewerImages(props.study_id, token, loading_data.current, 
            setSeries_lengths, functions)
        .then((images) => {
            if (images.length === 0) {
                console.error("No instances for study");
            }
            loading.current = false;
            setProgress(100);
        });
        
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);
    
    if(loading.current && series_lengths.length !== 0)
    {
        loading.current = false;
    }
    
    const dispatch = useDispatch();
    const handleBackButtonClick = () => {
        dispatch(setOpenViewer({
            should_open: false,
            study_id: ""
        }));
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        return true;
    }   
    return (
        <SafeAreaView
            style={styles.main_screen}
        >
            {loading.current &&
                <View
                    style={styles.loading_text_view}
                >
                    <ActivityIndicator size="large" color="000000"></ActivityIndicator>
                    <Text style={styles.loading_text}>Rabdarea e o virtute...</Text>
                </View>
            }
            {/* This "length != 0" is a little hack because 
            react caches the drawer with empty data on creation */}
            {!loading.current && loading_data.current[0].length !== 0 &&
                <Drawer.Navigator
                    drawerContent={(props) => <SeriesView {...props} />}
                >
                    <Drawer.Screen
                        name='MainImage'
                        component={MainImageView}
                        initialParams={{
                            length: series_lengths[0],
                            seriesData: loading_data.current[0],
                            study_id: props.study_id
                        }}
                        options={{
                            headerStyle: {backgroundColor: 'black'},
                            headerTintColor: 'red',
                            headerTitleStyle: {
                                display: 'none'
                            },
                            headerRight: () => (
                                <TouchableOpacity
                                    style={styles.close_button}
                                    onPress={() => {
                                        handleBackButtonClick();
                                    }}
                                >
                                    <AntDesign name="close" size={24} color="red" />
                                </TouchableOpacity>
                            ),
                            drawerStyle: {
                                backgroundColor: 'black'
                            }
                        }}
                    />
                </Drawer.Navigator>
            }

        </SafeAreaView>
    );
}
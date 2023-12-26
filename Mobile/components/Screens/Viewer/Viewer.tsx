import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    View,
    SafeAreaView,
    BackHandler,
    TouchableOpacity,
} from 'react-native';
import { getViewerImages, getAllPatients } from '../../../dataRequests/OrthancData';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setOpenViewer } from '../../../features/globalStateSlice';
import { viewerData } from '../../../types/ViewerData';
import { Image } from 'expo-image';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { MainImageView } from './MainImageView';

const styles = StyleSheet.create({
    main_screen: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center'
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

export function Viewer(props: { study_id: string }) {
    function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
        return (
            <View
                style={{ flex: 1 }}
            >
                <Text
                    style={styles.drawer_header}
                >
                    Series
                </Text>
                <FlatList
                    style={[styles.series_list, {height: "100%"}]}
                    data={all_data.current}
                    showsHorizontalScrollIndicator={false}
                    renderItem={(item) => {
                        return (
                            <TouchableOpacity
                                style={{alignItems: 'center'}}
                                onPress={(e) => {
                                    navigation.navigate('MainImage', {
                                        seriesData: all_data.current[item.index].series
                                    });
                                }}
                            >
                                <Image
                                    style={{ height: 200, width: 200 }}
                                    source={{ uri: `data:image/png;base64,${item.item.series[Math.round(item.item.series.length / 2)]?.data}` }}
                                />
                            </TouchableOpacity>
                        )
                    }
                    } />
            </View>
        );
    }
    const [loading, setLoading] = useState(true);
    // We use these refs so we can have peristent data between renders
    const all_data = useRef<viewerData[]>(null);
    const token = useSelector(selectToken);
    let startTime = useRef(null);
    useEffect(() => {
        getViewerImages(props.study_id, token).then((images) => {
            if (images.length !== 0) {
                all_data.current = images;
            }
            else {
                console.error("No instances for study");
            }
            setLoading(false);
        });
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        startTime.current = (new Date()).getTime();
    }, []);

    //TODO: delete this test
    if (!loading) {
        console.log("Time elapsed: ", (new Date().getTime() - startTime.current) / 1000.0 + "s");
    }

    const dispatch = useDispatch();
    const handleBackButtonClick = () => {
        dispatch(setOpenViewer(false));
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        return true;
    }
    return (
        <SafeAreaView
            style={styles.main_screen}
        >
            {loading &&
                <View
                    style={styles.loading_text_view}
                >
                    <Text style={styles.loading_text}>Loading...</Text>
                </View>
            }
            {!loading &&
                <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                >
                    <Drawer.Screen
                        name='MainImage'
                        component={MainImageView}
                        initialParams={{
                            seriesData: all_data.current[0].series
                        }}
                        options={{
                            headerStyle: {backgroundColor: 'black'},
                            headerTintColor: 'red',
                            headerTitleStyle: {
                                display: 'none'
                            },
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
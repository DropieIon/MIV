import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

import { selectToken, selectIsMedic, selectOpenViewer } from "../../../features/globalStateSlice";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Authentication from "../Authentification/Authentication";
import SettingsScreen from "../Settings/SettingsScreen";
import DefaultView from "../../Templates/DefaultView";
import { useEffect, useRef, useState } from "react";
import { Viewer } from "../Viewer/Viewer";
import { getStudies, studiesListEntry } from "../../../dataRequests/OrthancData";
import { viewerState } from "../../../features/ViewerTypes";

const Drawer = createDrawerNavigator();

export function LandingScreen(props) {
    const token = useSelector(selectToken);
    const isMedic = useSelector(selectIsMedic);
    const viewer: viewerState = useSelector(selectOpenViewer);
    const [loading, setLoading] = useState(true);
    let studies_list = useRef<studiesListEntry[]>(null);
    useEffect(() => {
        if(token !== "")
        {
            getStudies(token)
            .then((data) => {
                studies_list.current = data;
                setLoading(false);
                console.log("loaded at:", (new Date()).toLocaleTimeString());
                
            })
        }
    }, [token])
    return (
        <SafeAreaView
            style={{flex:1}}
        >
            {loading && token &&
                <View
                    style={{
                        justifyContent: 'center',
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color="0000ff"
                    />
                    <Text
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        Loading...
                    </Text>
                </View>
            }
            {!loading && token && viewer.should_open && <Viewer study_id={viewer.study_id} />}
            {!loading && token && !viewer.should_open &&
                <Drawer.Navigator>
                    <Drawer.Screen
                        name={isMedic? 'Patients' : 'Studies'}
                        component={DefaultView}
                        initialParams={{
                            isMedic: isMedic, 
                            studies_list: studies_list.current
                        }}
                        />
                    <Drawer.Screen
                        name='Settings'
                        component={SettingsScreen}
                    />
                </Drawer.Navigator>
            }
            {!token && !viewer.should_open && <Authentication/>}
        </SafeAreaView>
    )
}
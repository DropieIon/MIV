import { SafeAreaView, Text } from "react-native";

import { selectToken, selectIsMedic, selectOpenViewer } from "../../../features/globalStateSlice";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Authentication from "../Authentification/Authentication";
import SettingsScreen from "../Settings/SettingsScreen";
import DefaultView from "../../Templates/DefaultView";
import { useEffect, useRef, useState } from "react";
import { Viewer } from "../Viewer/Viewer";
import { getStudies } from "../../../dataRequests/OrthancData";

const Drawer = createDrawerNavigator();

export function LandingScreen(props) {
    const token = useSelector(selectToken);
    const isMedic = useSelector(selectIsMedic);
    const viewer = useSelector(selectOpenViewer);
    const [loading, setLoading] = useState(true);
    let studies_list = useRef<string[]>(null);
    useEffect(() => {
        // TODO: change this when patient backend is implemented:
        if(token !== "")
        {
            getStudies("8e9e8135-f9e05d3e-aa128825-97883040-ec6c49a5", token)
            .then((data) => {
                studies_list.current = data;
                setLoading(false);
            })
        }
    }, [token])
    return (
        <SafeAreaView
            style={{flex:1}}
        >
            {/* TODO: make this full screen */}
            {token && loading && <Text style={{flex:1}}>Loading</Text>}
            {/* TODO: change this to be the current study */}
            {!loading && token && viewer && <Viewer study_id={studies_list.current[0]} />}
            {!loading && token && !viewer &&
                <Drawer.Navigator>
                    <Drawer.Screen
                        name={isMedic? 'Patients' : 'Studies'}
                        component={DefaultView} />
                    <Drawer.Screen
                        name='Settings'
                        component={SettingsScreen}
                    />
                </Drawer.Navigator>
            }
            {!token && !viewer && <Authentication/>}
        </SafeAreaView>
    )
}
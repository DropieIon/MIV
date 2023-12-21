import { SafeAreaView } from "react-native";

import { selectToken, selectIsMedic, selectOpenViewer } from "../../../features/globalStateSlice";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Authentication from "../Authentification/Authentication";
import SettingsScreen from "../Settings/SettingsScreen";
import DefaultView from "../../Templates/DefaultView";
import { useState } from "react";
import { Viewer } from "../Viewer/Viewer";

const Drawer = createDrawerNavigator();

export function LandingScreen(props) {
    const token = useSelector(selectToken);
    const isMedic = useSelector(selectIsMedic);
    const viewer = useSelector(selectOpenViewer);
    return (
        <SafeAreaView
            style={{flex:1}}
        >
            {token && viewer && <Viewer/>}
            {token && !viewer &&
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
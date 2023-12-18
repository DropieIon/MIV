import { SafeAreaView } from "react-native";

import { selectToken } from "../../../features/jwtSlice";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';
import DefaultViewDoc from "../../Doctor/DefaultViewDoc";
import Authentication from "../Authentification/Authentication";

const Drawer = createDrawerNavigator();

/*
    TODO: change this so it show the drawer only when the token is valid 
    and decide what to do when it's not
*/

export function LandingScreen(props) {
    const token = useSelector(selectToken);
    return (
        <SafeAreaView
            style={{flex:1}}
        >
            {token &&
                <Drawer.Navigator>
                    <Drawer.Screen
                        name='Patients'
                        component={DefaultViewDoc} />
                </Drawer.Navigator>
            }
            {!token && <Authentication/>}
        </SafeAreaView>
    )
}
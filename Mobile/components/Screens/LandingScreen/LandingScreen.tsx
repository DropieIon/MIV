import { SafeAreaView } from "react-native";
import { selectToken, selectOpenViewer } from "../../../features/globalStateSlice";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Authentication from "../Authentification/Authentication";
import SettingsScreen from "../Settings/SettingsScreen";
import ViewPatients from "../PatAndStudies/ViewPatients";
import { Viewer } from "../Viewer/Viewer";
import { viewerState } from "../../../features/ViewerTypes";
import { parseJwt } from "../../../utils/helper";
import { RequestOrAssign } from "../MedPatLinks/RequestOrAssing";
import { MedicRequests } from "../PersonalRequests/MedicRequests";
import { CustomDrawer } from "../../CustomDrawer";
import ViewStudies from "../PatAndStudies/ViewStudies";

const Drawer = createDrawerNavigator();

const drawerScreenOptions = {
    headerStyle: {
        backgroundColor: '#2F80ED',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        color: 'white'
    }
};

export function LandingScreen(props) {
    const token = useSelector(selectToken);
    const viewer: viewerState = useSelector(selectOpenViewer);
    const medic = token ? parseJwt(token)?.isMedic === 'Y' : false;
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            {token && viewer.should_open &&
                <Viewer study_id={viewer.study_id} />
            }
            {token && !viewer.should_open &&
                <Drawer.Navigator
                    initialRouteName={medic ? 'Patients' : 'Studies'}
                    drawerContent={(props) => <CustomDrawer {...props} />}
                    screenOptions={({ route }) => ({
                        activeTintColor: '#8772BC',
                        headerShown: true,
                    })}>
                    <Drawer.Screen
                        name={'Studies'}
                        component={ViewStudies}
                        options={drawerScreenOptions}
                    />
                    <Drawer.Screen
                        name={'Patients'}
                        component={ViewPatients}
                        options={drawerScreenOptions}
                        initialParams={{
                            listStudies: !medic,
                        }}
                    />
                    <Drawer.Screen
                        name={parseJwt(token).isMedic === 'N' ? 'All Doctors' : 'All Patients'}
                        options={drawerScreenOptions}
                        component={RequestOrAssign}
                    />
                    <Drawer.Screen
                        name={parseJwt(token).isMedic === 'N' ? 'My Requests' : 'Requests'}
                        options={drawerScreenOptions}
                        component={MedicRequests}
                    />
                    <Drawer.Screen
                        name='Settings'
                        component={SettingsScreen}
                    />
                </Drawer.Navigator>
            }
            {!token && !viewer.should_open && <Authentication />}
        </SafeAreaView>
    )
}
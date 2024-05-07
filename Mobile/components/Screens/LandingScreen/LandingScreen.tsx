import { SafeAreaView } from "react-native";
import { selectToken, selectOpenViewer, selectCurrentAccountFullName } from "../../../features/globalStateSlice";
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
import { PersonalDataForm } from "../Authentification/PersonalData/PersonalDataForm";

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
    const fullName = useSelector(selectCurrentAccountFullName);
    const hasCompleted = fullName !== null;
    const viewer: viewerState = useSelector(selectOpenViewer);
    const medic = token !== "" ? parseJwt(token)?.role === 'med' : false;
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            {token !== "" && !hasCompleted &&
                <PersonalDataForm/>
            }
            {token !== "" && hasCompleted && viewer.should_open &&
                <Viewer study_id={viewer.study_id} />
            }
            {token !== "" && hasCompleted && !viewer.should_open &&
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
                            viewPatientsType: 'personal'
                        }}
                    />
                    <Drawer.Screen
                        name={!medic ? 'All Doctors' : 'All Patients'}
                        options={drawerScreenOptions}
                        component={RequestOrAssign}
                    />
                    <Drawer.Screen
                        name={!medic ? 'My Requests' : 'Requests'}
                        options={drawerScreenOptions}
                        component={MedicRequests}
                    />
                    <Drawer.Screen
                        name='Settings'
                        component={SettingsScreen}
                    />
                </Drawer.Navigator>
            }
            {token === "" && !viewer.should_open && <Authentication />}
        </SafeAreaView>
    )
}
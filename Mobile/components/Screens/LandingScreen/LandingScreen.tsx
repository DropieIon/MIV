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
    let admin, medic, initialRouteName;
    if(token !== "") {
        const jwtBody = parseJwt(token);
        admin = jwtBody?.role === "admin";
        medic = admin ? false : jwtBody?.role === 'med';
        initialRouteName = admin ? 'All Patients' : medic ? 'Patients' : 'Studies';
    }
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
                    initialRouteName={initialRouteName}
                    drawerContent={(props) => <CustomDrawer {...props} />}
                    screenOptions={({ route }) => ({
                        activeTintColor: '#8772BC',
                        headerShown: true,
                    })}>
                    {admin ?
                    <></>
                    :
                    <Drawer.Screen
                        name={'Studies'}
                        component={ViewStudies}
                        options={drawerScreenOptions}
                    />}
                    {admin ?
                    <></>
                    :
                    <Drawer.Screen
                        name={'Patients'}
                        component={ViewPatients}
                        options={drawerScreenOptions}
                        initialParams={{
                            listStudies: !medic,
                            viewPatientsType: 'personal'
                        }}
                    />}
                    <Drawer.Screen
                        name={admin ? 'All Patients' : !medic ? 'All Doctors' : 'All Patients'}
                        options={drawerScreenOptions}
                        component={RequestOrAssign}
                    />
                    {admin ?
                        <Drawer.Screen
                            name={'All Docs'}
                            options={drawerScreenOptions}
                            component={RequestOrAssign}
                        />
                        :
                        <></>
                    }
                    {admin ?
                    <></>
                    :
                    <Drawer.Screen
                        name={!medic ? 'My Requests' : 'Requests'}
                        options={drawerScreenOptions}
                        component={MedicRequests}
                    />}
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
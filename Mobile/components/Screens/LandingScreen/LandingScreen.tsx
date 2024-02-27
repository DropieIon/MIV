import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

import { selectToken, selectLoadStudies, selectOpenViewer } from "../../../features/globalStateSlice";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Authentication from "../Authentification/Authentication";
import SettingsScreen from "../Settings/SettingsScreen";
import DefaultView from "../../Templates/DefaultView";
import { useEffect, useRef, useState } from "react";
import { Viewer } from "../Viewer/Viewer";
import { getStudies, studiesListEntry } from "../../../dataRequests/DicomData";
import { viewerState } from "../../../features/ViewerTypes";
import { accountDataListEntry } from "../../../types/ListEntry";
import { getPatients } from "../../../dataRequests/PatientData";
import { parseJwt } from "../../../utils/helper";
import { RequestOrAssign } from "../MedPatLinks/RequestOrAssing";
import { MedicRequests } from "../PersonalRequests/MedicRequests";

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
    const loadStudies = useSelector(selectLoadStudies);
    const viewer: viewerState = useSelector(selectOpenViewer);
    const [loading, setLoading] = useState(true);
    let studies_list = useRef<studiesListEntry[]>(null);
    let patients_list = useRef<accountDataListEntry[]>(null);
    useEffect(() => {
        if (token !== "") {
            if (parseJwt(token).isMedic === 'N') {
                getStudies(token)
                    .then((data) => {
                        studies_list.current = data;
                        setLoading(false);
                        console.log("loaded at:", (new Date()).toLocaleTimeString());

                    });
            } else {
                getPatients(token)
                    .then((patients) => {
                        patients_list.current = patients;
                        setLoading(false);
                    });
            }
        }
    }, [token])
    return (
        <SafeAreaView
            style={{ flex: 1 }}
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
            {!loading && token && viewer.should_open &&
                <Viewer study_id={viewer.study_id} />
            }
            {!loading && token && !viewer.should_open &&
                <Drawer.Navigator>
                    <Drawer.Screen
                        name={loadStudies ? 'Patients' : 'Studies'}
                        component={DefaultView}
                        options={drawerScreenOptions}
                        initialParams={{
                            listStudies: !loadStudies,
                            items_list: !loadStudies ? studies_list.current : patients_list.current
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
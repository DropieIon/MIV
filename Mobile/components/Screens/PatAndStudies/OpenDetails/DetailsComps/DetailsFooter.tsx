import { Text, TouchableOpacity, View } from "react-native";
import { DetailsStyles } from "../DetailsStyles";
import { assignPatient, cancelRequest, makeRequest, unassignPatient } from "../../../../../dataRequests/AssignRequestsData";
import { useSelector } from "react-redux";
import { selectAccountDetails, selectToken } from "../../../../../features/globalStateSlice";
import { DetailsPropsTemplate } from "../PropsTemplate";
import { parseJwt } from "../../../../../utils/helper";
import { allowUnlimUploads4h } from "../../../../../dataRequests/PatientData";

export function DetailsFooter(props: DetailsPropsTemplate) {
    const token = useSelector(selectToken);
    const accountDetails = useSelector(selectAccountDetails);
    const unassign = ['PatsAssigned', 'Study'].includes(props.type);
    const patsAssigned = props.type === 'PatsAssigned';
    const medic = parseJwt(token)?.role === 'med';
    return (
        <View
            style={
                [DetailsStyles.footerMainViewNormal,
                    patsAssigned ? DetailsStyles.footerMainViewPatsAssigned : {}]}
        >
            {medic && props.type === 'PatsAssigned' &&
            <TouchableOpacity
                style={DetailsStyles.footerUnlimUploadsButton}
                onPress={() => {
                    allowUnlimUploads4h(token, accountDetails.username)
                    .then((resp) => {
                        if(resp === null) {
                            props.setRespUnlim4h('Could not allow patient');
                            return;
                        }
                        props.setRespUnlim4h(`${accountDetails.fullName} now has unlimited uploads for 4h`);
                    })
                }}
            >
                <Text
                    style={[DetailsStyles.footerText, DetailsStyles.footerUnlimUploadsText]}
                >
                    Unlimited uploads 4h
                </Text>
            </TouchableOpacity>}
            <TouchableOpacity
                style={[DetailsStyles.footerUnassignButtonNormal,
                    patsAssigned ? DetailsStyles.footerUnassignButtonPatsAssigned : {}
                ]}
                onPress={() => {
                    props.type === 'My Requests' ? 
                    cancelRequest(token, accountDetails.username)
                    .then(() => {
                        props.setRefreshPatList(Math.random() * 420);
                        props.setOpenDetails(false);
                    })
                    :
                    unassign ?
                    unassignPatient(token, accountDetails.username)
                    .then(() => {
                        props.setRefreshPatList(Math.random() * 420);
                        props.setOpenDetails(false);
                    })
                    :
                    medic ?
                    assignPatient(token, accountDetails.username)
                    .then(() => {
                        props.setRefreshPatList(Math.random() * 420);
                        props.setOpenDetails(false);
                    })
                    :
                    makeRequest(token, accountDetails.username)
                    .then(() => {
                        props.setRefreshPatList(Math.random() * 420);
                        props.setOpenDetails(false);
                    });
                }}
            >
                <View
                    style={DetailsStyles.footerTextContainer}
                >
                    <Text
                        style={DetailsStyles.footerText}
                    >
                        {props.type === 'My Requests' ? 'Cancel request' : unassign ? 'Unassign' : medic ? 'Assign' : 'Request'}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
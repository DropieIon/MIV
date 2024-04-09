import { Text, TouchableOpacity, View } from "react-native";
import { DetailsStyles } from "../DetailsStyles";
import { assignPatient, cancelRequest, makeRequest, unassignPatient } from "../../../../../dataRequests/AssignRequestsData";
import { useSelector } from "react-redux";
import { selectAccountDetails, selectToken } from "../../../../../features/globalStateSlice";
import { DetailsPropsTemplate } from "../PropsTemplate";
import { parseJwt } from "../../../../../utils/helper";

export function DetailsFooter(props: DetailsPropsTemplate) {
    const token = useSelector(selectToken);
    const accountDetails = useSelector(selectAccountDetails);
    const unassign = ['PatsAssigned', 'Study'].includes(props.type);
    const medic = parseJwt(token)?.isMedic === 'Y';
    return (
        <View
            style={DetailsStyles.footerMainView}
        >
            <TouchableOpacity
                style={DetailsStyles.footerUnassignButton}
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
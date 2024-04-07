import { Text, TouchableOpacity, View } from "react-native";
import { DetailsStyles } from "../DetailsStyles";
import { unassignPatient } from "../../../../../dataRequests/AssignRequestsData";
import { useSelector } from "react-redux";
import { selectPatDetails, selectToken } from "../../../../../features/globalStateSlice";

type propsTemplate = {
    setRefreshPatList,
    setOpenDetails
}

export function DetailsFooter(props: propsTemplate) {
    const token = useSelector(selectToken);
    const patDetails = useSelector(selectPatDetails);
    return (
        <View
            style={DetailsStyles.footerMainView}
        >
            <TouchableOpacity
                style={DetailsStyles.footerUnassignButton}
                onPress={() => {
                    unassignPatient(token, patDetails.username)
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
                        Unassign
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
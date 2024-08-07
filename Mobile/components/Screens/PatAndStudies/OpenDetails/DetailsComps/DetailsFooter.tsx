import { Text, TouchableOpacity, View } from "react-native";
import { DetailsStyles } from "../DetailsStyles";
import { assignPatient, cancelRequest, makeRequest, unassignPatient } from "../../../../../dataRequests/AssignRequestsData";
import { useSelector } from "react-redux";
import { selectAccountDetails, selectToken, selectViewStudies } from "../../../../../features/globalStateSlice";
import { DetailsPropsTemplate } from "../PropsTemplate";
import { parseJwt } from "../../../../../utils/helper";
import { allowUnlimUploads4h, promotePat } from "../../../../../dataRequests/PatientData";
import { deleteStudy, unassignStudy } from "../../../../../dataRequests/DicomData";
import { demoteDoc } from "../../../../../dataRequests/DoctorData";

export function DetailsFooter(props: DetailsPropsTemplate) {
    const token = useSelector(selectToken);
    const accountDetails = useSelector(selectAccountDetails);
    const jwtBody = parseJwt(token);
    const admin = jwtBody?.role === "admin";
    const medic = jwtBody?.role === 'med';
    const twoButtons = ['PatsAssigned', 'Study'].includes(props.type) && medic;
    let redButtonText: string;
    switch (props.type) {
        case "My Requests":
            redButtonText = 'Cancel Request'
            break;
        case "PatsAssigned":
            redButtonText = 'Unassign';
            break;
        case "Study":
            redButtonText = medic ? 'Delete' : 'Unassign';
            break;
        case "UnassignedStudies":
            redButtonText = 'Delete';
            break;
        case "Requests":
            redButtonText = medic ? 'Assign' : 'Request';
            break;
        case "AllPats":
            redButtonText = admin ? props.adminList === "med" ? "Demote" : "Promote" : medic ? "Assign" : "Request"
            break;
        default:
            break;
    }
    return (
        <View
            style={
                [DetailsStyles.footerMainViewNormal,
                props.type === "PatsAssigned" ? DetailsStyles.footerMainViewPatsAssigned : {},
                ["Study", "UnassignedStudies"].includes(props.type) ? DetailsStyles.footerMainViewStudies : {}
                ]}
        >
            {medic && twoButtons &&
                <TouchableOpacity
                    style={DetailsStyles.footerUnlimUploadsOrUnAssignStudyButton}
                    onPress={() => {
                        switch (props.type) {
                            case 'Study':
                                unassignStudy(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    });
                                break;
                            case 'PatsAssigned':
                                allowUnlimUploads4h(token, accountDetails.username)
                                    .then((resp) => {
                                        if (resp === null) {
                                            props.setRespUnlim4h('Could not allow patient');
                                            return;
                                        }
                                        props.setRespUnlim4h(`${accountDetails.fullName} now has unlimited uploads for 4h`);
                                    })
                                break;
                            default:
                                break;
                        }
                    }}
                >
                    <Text
                        style={[DetailsStyles.footerText, DetailsStyles.footerUnlimUploadsText]}
                    >
                        {props.type === "PatsAssigned" ? 'Unlimited uploads 4h' : 'Unassign Study'}
                    </Text>
                </TouchableOpacity>}
            <TouchableOpacity
                style={[DetailsStyles.footerUnassignButtonNormal,
                twoButtons ? DetailsStyles.footerUnassignButtonPatsAssigned : {},
                (props.type === "Study" && !medic) || props.type === "UnassignedStudies" ?
                        {
                            height: "50%",
                            top: "30%"
                        }
                        :
                        {},
                ]}
                onPress={() => {
                    switch (props.type) {
                        case "My Requests":
                            cancelRequest(token, accountDetails.username)
                                .then(() => {
                                    props.setRefreshPatList(Math.random() * 420);
                                    props.setOpenDetails(false);
                                })
                            break;
                        case "PatsAssigned":
                            unassignPatient(token, accountDetails.username)
                                .then(() => {
                                    props.setRefreshPatList(Math.random() * 420);
                                    props.setOpenDetails(false);
                                })
                            break;
                        case "Study":
                            // username is also used for study_id
                            if(medic) {
                                deleteStudy(token, accountDetails.username)
                                .then(() => {
                                    props.setRefreshPatList(Math.random() * 420);
                                    props.setOpenDetails(false);
                                });
                            }
                            else {
                                unassignStudy(token, accountDetails.username)
                                .then(() => {
                                    props.setRefreshPatList(Math.random() * 420);
                                    props.setOpenDetails(false);
                                });
                            }
                            break;
                        case "UnassignedStudies":
                            // username is also used for study_id
                            if (medic) {
                                deleteStudy(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    });
                            }
                            break;
                        case "Requests":
                            if (medic)
                                assignPatient(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    })
                            else
                                makeRequest(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    });
                            break;
                        case "AllPats":
                            if (medic)
                                assignPatient(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    })
                            else if (admin) {
                                if (props.adminList === "pat") {
                                    promotePat(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    });
                                }
                                else if(props.adminList === "med") {
                                    demoteDoc(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    })
                                }
                                else {
                                    console.error("Bad adminList value");
                                    return;
                                }
                            }
                            else
                                makeRequest(token, accountDetails.username)
                                    .then(() => {
                                        props.setRefreshPatList(Math.random() * 420);
                                        props.setOpenDetails(false);
                                    });
                            break;
                        default:
                            break;
                    }
                }}
            >
                <View
                    style={DetailsStyles.footerTextContainer}
                >
                    <Text
                        style={DetailsStyles.footerText}
                    >
                        {redButtonText}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
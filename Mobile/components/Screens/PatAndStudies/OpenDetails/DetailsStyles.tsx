import { StyleSheet } from "react-native"

const textColor = "white";

export const iconColor = "white";

export const DetailsStyles = StyleSheet.create({
    modalMainViewNormal: {
        height: "30%",
        top: "70%",
        backgroundColor: '#16171B',
        borderTopEndRadius: 50,
        borderTopStartRadius: 50
    },
    modalMainViewPatsAssigned: {
        height: "35%",
        top: "65%",
    },

    headerMainViewNormal: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: "60%"
    },
    headerMainViewPatsAssigned: {
        height: "45%"
    },
    headercloseButton: {
        position: 'absolute',
        zIndex: 3,
        right: "1%"
    },
    headerImageTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerImage: {
        left: "10%",
        width: "20%",
    },
    headerFullName: {
        width: "60%",
        right: "10%",
        left: "30%",
        height: 75,
        textAlign: 'center',
        color: textColor,
        fontSize: 34,
        textAlignVertical: 'center',
    },

    infoMainView: {
        flexDirection: 'row',
        height: "20%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoIconAndTextContainer: {
        flexDirection: 'row',
        width: "33%",
        height: "100%"
    },
    infoIcon: {
        flex: 3,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    infoText: {
        flex: 5,
        textAlignVertical: 'center',
        color: textColor
    },

    footerMainViewNormal: {
        width: "100%",
        height: "20%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerMainViewPatsAssigned: {
        height: "35%",
    },
    footerMainViewStudies: {
        height: "40%"
    },
    footerUnassignButtonNormal: {
        width: "100%",
        height: "100%",
        backgroundColor: '#EB5160'
    },
    footerUnassignButtonPatsAssigned: {
        height: "50%"
    },
    footerUnlimUploadsOrUnAssignStudyButton: {
        width: "100%",
        height: "50%",
        justifyContent: 'center',
        backgroundColor: '#26272C'
    },
    footerUnlimUploadsText: {
        verticalAlign: 'middle',
    },
    footerTextContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    footerText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: textColor
    }
});

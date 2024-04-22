import { StyleSheet } from "react-native";

export const uploadStyles = StyleSheet.create({
    mainView: {
        height: '80%',
        top: "10%",
        width: '80%',
        left: '10%',
        borderRadius: 30,
        elevation: 5,
        backgroundColor: '#4F4F4F'
    },

    progressView: {
        height: '50%',
        top: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    cancelButton: {
        width: '50%',
        height: '10%',
        left: '25%',
        top: '25%',
        borderRadius: 50,
        elevation: 5,
        backgroundColor: '#EB5160',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
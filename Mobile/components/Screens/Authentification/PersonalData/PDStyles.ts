import { StyleSheet } from "react-native";

const reallyNiceBlue = "#2F80ED";

export const PDStyles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    detailsText: {
        padding: 10,
        fontSize: 24,
        textAlign: 'center',
        color: '#6495ED',
        fontFamily: 'serif'
    },

    personalDataView: {
        backgroundColor: reallyNiceBlue,
        width: "80%",
        height: "50%",
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        elevation: 5
    },

    imageView: {
        width: "100%",
        height: "60%",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 50,
    },

    formView: {
        height: "40%",
        width: "100%",
        alignItems: 'center',
    },

    fullNameInput: {
        height: "30%",
        width: "85%",
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 2
    },
    ageInput: {
        height: "30%",
        width: "85%",
        textAlign: 'center'
    },

    genderButton: {
        height: "40%",
        width: "85%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    genderText: {
    },

    submitButton: {
        top: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        padding: 5,
        elevation: 1,
    },
    submitButtonText: {
    },

    error: {
        color: 'red',
    },
    loading: {
        color: reallyNiceBlue,
    }


});
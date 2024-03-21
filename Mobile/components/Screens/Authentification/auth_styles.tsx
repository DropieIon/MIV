import {
    StyleSheet,
    Dimensions,
} from 'react-native';

export const textSize = 18;
export const marginBottom = 5;

export const auth_styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authText: {
        fontSize: Dimensions.get('window').height / 30,
        margin: 30,
    },
    textInput: {
        height: "13%",
        width: "85%",
        textAlign: 'center',
        fontSize: textSize,
        borderRadius: 5,
        borderWidth: 2,
        marginBottom: marginBottom,
    },
    error: {
        color: 'red',
        marginBottom: marginBottom
    },
    loading: {
        color: 'blue',
        marginBottom: marginBottom
    },
    authButton: {
        borderRadius: 5,
        borderWidth: 1,
    },
    authButtonText: {
        padding: 5,
        fontSize: textSize
    }
});
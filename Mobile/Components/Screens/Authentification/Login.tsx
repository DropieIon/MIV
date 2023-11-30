import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
    mainView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        fontSize: Dimensions.get('window').height / 30,
        margin: 30,
    },
    usernameInput: {
        height: "10%",
        marginBottom: 16
    },
    passwordInput: {
        height: "10%",
        marginBottom: 16
    },
    signUpView: {
        verticalAlign: 'center',
        flexDirection: "row",
        marginBottom: 16,
    },
    signUpText: {
        color: "blue",
        textDecorationLine: "underline",
        marginLeft: 2
    },
})

class Login extends Component {
    state = {
        username: "",
        password: "",
        error: "",
    }
    focusPass;
    render() {
        return (
            <View
                style={styles.mainView}
            >
                <Text
                    style={styles.signInText}
                >
                    Sign in
                </Text>
                <AnimatedInput
                    style={styles.usernameInput}
                    label="Username"
                    onSubmitEditing={(event) => {
                        this.focusPass.focus();
                        this.state.username = event.nativeEvent.text;  
                    }}
                />
                <AnimatedInput
                    style={styles.passwordInput}
                    label="Password"
                    onSubmitEditing={(event) => {
                        this.state.password = event.nativeEvent.text;
                        
                    }}
                    keyboardDone='y'
                    onRef={(r) => this.focusPass = r}
                />
                <View
                    style={styles.signUpView}
                >
                    <Text>
                        No account?
                    </Text>
                    <TouchableOpacity>
                        <Text
                            style={styles.signUpText}
                        >
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </View>
                <Button
                    title='Login'
                    onPress={() => console.log("Test")}
                />
            </View>
        )

    }

}
export default Login;
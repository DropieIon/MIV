import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import AnimatedInput from './AnimatedInput';

const styles = StyleSheet.create({
    mainView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: Dimensions.get('window').height / 30,
        margin: 30,
    },
    textInput: {
        height: "13%",
        marginBottom: 2,
    },
    signUpButton: {
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#33b249'
    },
    signUpButtonText: {
        padding: 5
    }
});

class SignUp extends Component {
    state = {
        fullName: "",
        username: "",
        email: "",
        password: "",
        errName: "",
        errEmail: "",
        errUsername: "",
        errPassFormat: "",
        errNoMatchPass: ""
    }
    fullName = "";
    refDict = {};
    render(): React.ReactNode {
        return (
            <View
                style={styles.mainView}
            >
                <Text
                    style={styles.signUpText}
                >
                    Sign up
                </Text>
                <AnimatedInput
                    style={styles.textInput}
                    label="Full name"
                    onSubmitEditing={(event) => {
                        const fname = event.nativeEvent.text;
                        if(/^[a-z ,.'-]+\ [a-z ,.'-]+$/.test(fname)){
                            this.setState({errName: ""});
                            this.refDict["email"].focus();
                            this.state.fullName = fname;
                        }
                        else {
                            this.setState({errName: "Format: <F_name> <L_name>"});       
                        }
                    }}
                    errorText={this.state.errName}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Email"
                    errorText={this.state.errEmail}
                    onSubmitEditing={(event) => {
                        const email = event.nativeEvent.text;
                        if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
                            this.setState({errEmail: ""});
                            this.refDict["username"].focus();
                            this.state.email = email;
                        }
                        else {
                            this.setState({errEmail: "Invalid email format."});       
                            this.refDict["email"].focus();
                        }
                    }}
                    onRef={(r) => this.refDict["email"] = r}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Username"
                    errorText={this.state.errUsername}
                    onSubmitEditing={(event) => {
                        const username = event.nativeEvent.text;
                        if(/^[a-zA-Z0-9]+$/.test(username)){
                            this.setState({errUsername: ""});
                            this.refDict["password"].focus();
                            this.state.username = username;
                        }
                        else {
                            this.setState({errUsername: "Only letters and numbers allowed."});
                            this.refDict["username"].focus();
                        }
                    }}
                    onRef={(r) => this.refDict["username"] = r}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Password"
                    onSubmitEditing={(event) => {
                        this.refDict["repeatPassword"].focus();
                        this.state.password = event.nativeEvent.text;  
                    }}
                    errorText={this.state.errPassFormat}
                    onRef={(r) => this.refDict["password"] = r}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Repeat password"
                    onSubmitEditing={(event) => {
                        if(event.nativeEvent.text !== this.state.password)
                            this.setState({ errNoMatchPass: "Passwords do not match." });
                        else
                            this.setState({ errNoMatchPass: "" });
                    }}
                    errorText={this.state.errNoMatchPass}
                    keyboardDone='y'
                    onRef={(r) => this.refDict["repeatPassword"] = r}
                />
                <TouchableOpacity
                    style={styles.signUpButton}
                >
                    <Text
                        style={styles.signUpButtonText}
                    >
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default SignUp;
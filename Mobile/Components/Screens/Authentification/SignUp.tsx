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
        errNoMatchPass: "",
        errEmpty: false,
    }
    refDict = {};
    validateAllFields = () => {
        if(this.state.errName === ""
        && this.state.errEmail === ""
        && this.state.errUsername === ""
        && this.state.errNoMatchPass === "")
            // no errors
            if(this.state.fullName !== ""
            && this.state.email !== ""
            && this.state.username !== ""
            && this.state.password !== ""){
                // it's not empty
                this.setState({errEmpty: false});
                return true;
            }
            else {
                this.setState({errEmpty: true})
                return false;
            }
        return false;

    }
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
                    onChangeText={(txt) => {
                        const fname = txt;
                        if(/^[a-z ,.'-]+\ [a-z ,.'-]+$/.test(fname)){
                            this.setState({errName: ""});
                            this.state.fullName = fname;
                        }
                        else {
                            this.setState({errName: "Format: <F_name> <L_name>"});       
                        }
                    }}
                    onSubmitEditing={() => {
                        if(this.state.errName === "")
                            this.refDict["email"].focus();
                    }}
                    onRef={(r) => this.refDict["name"] = r}
                    errorText={this.state.errName}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Email"
                    errorText={this.state.errEmail}
                    onChangeText={(text) => {
                        const email = text;
                        if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
                            this.setState({errEmail: ""});
                            this.state.email = email;
                        }
                        else {
                            this.setState({errEmail: "Invalid email format."});
                        }
                    }}
                    onSubmitEditing={() => {
                        if (this.state.errEmail === "")
                            this.refDict["username"].focus();
                    }}
                    onRef={(r) => this.refDict["email"] = r}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Username"
                    errorText={this.state.errUsername}
                    onChangeText={(text) => {
                        const username = text;
                        if(/^[a-zA-Z0-9]+$/.test(username)){
                            this.setState({errUsername: ""});
                            this.state.username = username;
                        }
                        else {
                            this.setState({errUsername: "Only letters and numbers allowed."});
                        }
                    }}
                    onSubmitEditing={() => {
                        if(this.state.errUsername === "")
                            this.refDict["password"].focus();
                    }}
                    onRef={(r) => this.refDict["username"] = r}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Password"
                    onChangeText={(text) => {
                        this.state.password = text;
                    }}
                    onSubmitEditing={(event) => {
                        this.refDict["repeatPassword"].focus();  
                    }}
                    onRef={(r) => this.refDict["password"] = r}
                />
                <AnimatedInput
                    style={styles.textInput}
                    label="Repeat password"
                    onChangeText={(text) => {
                        if(text !== this.state.password)
                            this.setState({ errNoMatchPass: "Passwords do not match." });
                        else
                            this.setState({ errNoMatchPass: "" });
                    }}
                    errorText={this.state.errNoMatchPass}
                    keyboardDone='y'
                    onRef={(r) => this.refDict["repeatPassword"] = r}
                />
                {this.state.errEmpty && 
                <Text
                    style={{
                        marginBottom: 16,
                        color: "red"
                    }}
                >
                    Fields shouldn't be empty!
                </Text>
                }
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={() => {
                        if(this.validateAllFields()){
                            
                        }
                    }}
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
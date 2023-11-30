import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { selectToken, setToken } from '../../../features/jwtSlice';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const textSize = 18;
const marginBottom = 5;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
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
        color: 'red'
    },
    buttonPickerMedic: {
        marginBottom: marginBottom,
    },
    textPickerMedic: {
        fontSize: textSize,
        color: '#4681f4',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    pickerMedic: {
        display: 'none',
        opacity: 0,
        height: 0,
        width: 0,
    },
    signUpButton: {
        borderRadius: 5,
        borderWidth: 1,
    },
    signUpButtonText: {
        padding: 5
    }
});

function SignUp(props) {
    const token = useSelector(selectToken);
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isMedic, setIsMedic] = useState(false);
    const [errName, setErrName] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errUsername, setErrUsername] = useState("");
    const [errNoMatchPass, setErrNoMatchPass] = useState("");
    const [errEmpty, setErrEmpty] = useState(false);
    let ref_email = useRef(null);
    let ref_username = useRef(null);
    let ref_pass = useRef(null);
    let ref_repeat = useRef(null);
    let ref_isDoc = useRef(null);

    const handleOpenPickerMedic = () => {
        ref_isDoc.current.focus();
    }

    return (
        <View
            style={styles.mainView}
        >
            <Text
                style={styles.signUpText}
            >
                Sign up
            </Text>
            <TextInput
                style={[styles.textInput, { borderColor: errName ? 'red' : fullName ? 'lightblue' : 'lightgrey' }]}
                placeholder="Full name"
                returnKeyType='next'
                onChangeText={(txt) => {
                    const fname = txt;
                    if (/^[a-z ,.'-]+\ [a-z ,.'-]+$/.test(fname)) {
                        setErrName("");
                        setErrEmpty(false);
                        setFullName(fname);
                    }
                    else {
                        setFullName("");
                        setErrName("Format: <F_name> <L_name>");
                    }
                }}
                onSubmitEditing={() => {
                    if (errName === "")
                        ref_email?.current.focus();
                }}
            />
            {errName && <Text style={styles.error}>{errName}</Text>}
            <TextInput
                style={[styles.textInput, { borderColor: errEmail ? 'red' : email ? 'lightblue' : 'lightgrey'}]}
                placeholder="Email"
                returnKeyType='next'
                onChangeText={(text) => {
                    const emailExtracted = text;
                    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailExtracted)) {
                        setErrEmail("");
                        setErrEmpty(false);
                        setEmail(emailExtracted);
                    }
                    else {
                        setEmail("");
                        setErrEmail("Invalid email format.");
                    }
                }}
                onSubmitEditing={() => {
                    if (errEmail === "")
                        ref_username?.current.focus();
                }}
                ref={ref_email}
            />
            {errEmail && <Text style={styles.error}>{errEmail}</Text>}
            <TextInput
                style={[styles.textInput, { borderColor: errUsername ? 'red' : username ? 'lightblue' : 'lightgrey'}]}
                placeholder="Username"
                returnKeyType='next'
                onChangeText={(text) => {
                    const usernameExtracted = text;
                    if (/^[a-zA-Z0-9]+$/.test(usernameExtracted)) {
                        setErrUsername("");
                        setErrEmpty(false);
                        setUsername(usernameExtracted);
                    }
                    else {
                        setUsername("");
                        setErrUsername("Only letters and numbers allowed.");
                    }
                }}
                onSubmitEditing={() => {
                    if (errUsername === "")
                        ref_pass?.current.focus();
                }}
                ref={ref_username}
            />
            {errUsername && <Text style={styles.error}>{errUsername}</Text>}
            <TextInput
                style={[styles.textInput, { borderColor: password ? 'lightblue' : 'lightgrey'}]}
                placeholder="Password"
                returnKeyType='next'
                secureTextEntry
                onChangeText={(text) => {
                    setPassword(text);
                    setErrEmpty(false);
                }}
                onSubmitEditing={(event) => {
                    ref_repeat?.current.focus();
                }}
                ref={ref_pass}
            />
            <TextInput
                style={[styles.textInput, { borderColor: errNoMatchPass ? 'red' : password ? 'lightblue' : 'lightgrey' }]}
                placeholder='Repeat password'
                secureTextEntry
                onChangeText={(text) => {
                    if (text !== password)
                        setErrNoMatchPass("Passwords do not match.");
                    else {
                        setErrNoMatchPass("");
                        setErrEmpty(false);
                    }
                }}
                onSubmitEditing={() => {
                    ref_isDoc.current.focus();
                }}
                returnKeyType='next'
                ref={ref_repeat}
            />
            <View
                style={{flexDirection: 'row'}}
            >
                <Text style={{fontSize: textSize}}>Register as: </Text>
                <TouchableOpacity
                    style={styles.buttonPickerMedic}
                    onPress={handleOpenPickerMedic}
                >
                    <Text
                        style={styles.textPickerMedic}
                    >
                        {isMedic ? "Doctor" : "Patient"}
                    </Text>
                    <Picker
                        mode='dialog'
                        style={styles.pickerMedic}
                        ref={ref_isDoc}
                        selectedValue={isMedic}
                        onValueChange={(isDoctor, itemIndex) => setIsMedic(isDoctor ? true : false)}
                    >
                        <Picker.Item label="Doctor" value={true} />
                        <Picker.Item label="Patient" value={false} />
                    </Picker>
                </TouchableOpacity>
            </View>
            {errNoMatchPass && <Text style={styles.error}>{errNoMatchPass}</Text>}
            {errEmpty &&
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
                disabled={errEmpty ? true : false}
                style={[styles.signUpButton, { backgroundColor: errEmpty ? 'lightgrey' : '#33b249' }]}
                onPress={() => {
                    if (errName === ""
                        && errEmail === ""
                        && errUsername === ""
                        && errNoMatchPass === "")
                        // no errors
                        if (fullName !== ""
                            && email !== ""
                            && username !== ""
                            && password !== "") {
                            // it's not empty
                            setErrEmpty(false);
                            dispatch(setToken("da"));
                            axios.post("http://192.168.1.139:3000/login", {
                                username: username,
                                email: email,
                                password: password,
                                isMedic: isMedic
                            }).then((resp) => {
                                console.log("Test", resp.data);
                            })
                        }
                        else {
                            setErrEmpty(true);
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

export default SignUp;
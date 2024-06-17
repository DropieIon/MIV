import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { auth_styles } from './auth_styles';
import { BackendError } from '../../../../Backend/src/errors/BackendError.error';
import { useSelector } from 'react-redux';
import { selectServerAddress } from '../../../features/globalStateSlice';

function SignUp(props: {setDesiresSignUp}) {
    const serverAddress = useSelector(selectServerAddress);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errUsername, setErrUsername] = useState("");
    const [errNoMatchPass, setErrNoMatchPass] = useState("");
    const [errEmpty, setErrEmpty] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseRecv, setResponseRecv] = useState({msg: "", ok: true});
    let ref_email = useRef(null);
    let ref_username = useRef(null);
    let ref_pass = useRef(null);
    let ref_repeat = useRef(null);

    return (
        <View
            style={auth_styles.mainView}
        >
            <Text
                style={auth_styles.authText}
            >
                Sign up
            </Text>
            <TextInput
                style={[auth_styles.textInput, { borderColor: errEmail ? 'red' : email ? 'lightblue' : 'lightgrey'}]}
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
            {errEmail && <Text style={auth_styles.error}>{errEmail}</Text>}
            <TextInput
                style={[auth_styles.textInput, { borderColor: errUsername ? 'red' : username ? 'lightblue' : 'lightgrey'}]}
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
            {errUsername && <Text style={auth_styles.error}>{errUsername}</Text>}
            <TextInput
                style={[auth_styles.textInput, { borderColor: password ? 'lightblue' : 'lightgrey'}]}
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
                style={[auth_styles.textInput, { borderColor: errNoMatchPass ? 'red' : password ? 'lightblue' : 'lightgrey' }]}
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
                returnKeyType='done'
                ref={ref_repeat}
            />
            {errNoMatchPass && <Text style={auth_styles.error}>{errNoMatchPass}</Text>}
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
            {loading && <Text style={auth_styles.loading}>Signing up...</Text>}
            {responseRecv && 
                <Text
                    style={[auth_styles.error, responseRecv.ok ? {color: 'blue'}: {}]}>
                    {responseRecv.msg}
                </Text>
            }
            <TouchableOpacity
                disabled={errEmpty ? true : false}
                style={[auth_styles.authButton, { backgroundColor: errEmpty ? 'lightgrey' : '#33b249' }]}
                onPress={() => {
                    setLoading(true);
                    if (errEmail === ""
                        && errUsername === ""
                        && errNoMatchPass === "")
                        // no errors
                        if (email !== ""
                            && username !== ""
                            && password !== "") {
                            // it's not empty
                            setErrEmpty(false);
                            axios.post(`${serverAddress}/register`, {
                                username: username,
                                email: email,
                                password: password
                            })
                            .then((resp) => {
                                const msg = (resp as AxiosResponse<{ message: string }>).data.message;
                                setResponseRecv({msg: msg, ok: true});
                                setLoading(false);
                                props.setDesiresSignUp(false);
                            })
                            .catch((errorResp) => {
                                const errMsg = (errorResp as AxiosError<BackendError>).response.data
                                    .message;
                                setLoading(false);
                                setResponseRecv({msg: errMsg, ok: false});

                            })
                        }
                        else {
                            setErrEmpty(true);
                        }
                }}
            >
                <Text
                    style={auth_styles.authButtonText}
                >
                    Sign Up
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default SignUp;
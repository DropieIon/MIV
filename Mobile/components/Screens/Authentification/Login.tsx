import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';

import { textSize, marginBottom, auth_styles } from './auth_styles';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { setToken, setIsMedic } from '../../../features/globalStateSlice';
import { useDispatch } from 'react-redux';
import { backend_url } from '../../../configs/backend_url';
import { BackendError } from '../../../../Backend/src/errors/BackendError.error';
global.Buffer = global.Buffer || require('buffer').Buffer;

function parseJwt (token: string): {exp: number, isMedic: 'Y'| 'N'} {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const styles = StyleSheet.create({
    signUpView: {
        verticalAlign: 'center',
        flexDirection: "row",
        marginBottom: marginBottom,
    },
    signUpText: {
        fontSize: textSize,
        marginLeft: 5,
        marginBottom: marginBottom
    },
})

function Login(props: { passSignUp: () => void }) {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errUsername, setErrUsername] = useState("");
    const [errEmpty, setErrEmpty] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseRecv, setResponseRecv] = useState("");
    let focusPass = useRef(null);
    const refreshToken = (username: string, password: string) => {
        axios.post(`${backend_url}/login`, {
            username: username,
            password: password
        })
            .then((resp) => {
                const token = (resp as AxiosResponse<{ token: string }>).data.token;
                const current_time = Math.floor(new Date().getTime() / 1000);
                // refresh token when it expires
                setTimeout(() => refreshToken(username, password), 
                    (parseJwt(token).exp - current_time) * 1000);
                dispatch(setToken(token));
            })
            .catch((errorResp) => {
                const errMsg = (errorResp as AxiosError<BackendError>).response.data
                    .errors[0].message;
                setLoading(false);
                setResponseRecv(errMsg);
            })
    }
    return (
        <View
            style={auth_styles.mainView}
        >
            <Text
                style={auth_styles.authText}
            >
                Sign in
            </Text>
            <TextInput
                style={[auth_styles.textInput, { borderColor: errUsername ? 'red' : username ? 'lightblue' : 'lightgrey' }]}
                placeholder="Username"
                returnKeyType='next'
                onChangeText={(text) => {
                    if (/^[a-zA-Z0-9]+$/.test(text)) {
                        setErrUsername("");
                        setErrEmpty(false);
                        setUsername(text);
                    }
                    else {
                        setUsername("");
                        setErrUsername("Only letters and numbers allowed.");
                    }
                }}
                onSubmitEditing={() => {
                    if (errUsername === "")
                        focusPass?.current.focus();
                }}
            />
            {errUsername && <Text style={auth_styles.error}>{errUsername}</Text>}
            <TextInput
                style={[auth_styles.textInput, { borderColor: password ? 'lightblue' : 'lightgrey' }]}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => {
                    setErrEmpty(false);
                    setPassword(text);
                }}
                onSubmitEditing={(event) => {
                    setPassword(event.nativeEvent.text);
                }}
                returnKeyType='done'
                ref={focusPass}
            />
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
            <View
                style={styles.signUpView}
            >
                <Text
                    style={styles.signUpText}
                >
                    No account?
                </Text>
                <TouchableOpacity
                    onPress={props.passSignUp}
                >
                    <Text
                        style={[styles.signUpText, { color: "blue" }]}
                    >
                        Sign up
                    </Text>
                </TouchableOpacity>
            </View>
            {loading && <Text style={auth_styles.loading}>Signing in...</Text>}
            {responseRecv && <Text style={auth_styles.error}>{responseRecv}</Text>}
            <TouchableOpacity
                disabled={errEmpty ? true : false}
                style={[auth_styles.authButton, { backgroundColor: errEmpty ? 'lightgrey' : '#33b249' }]}
                onPress={() => {
                    if (errUsername === "")
                        // no errors
                        if (username !== ""
                            && password !== "") {
                            // it's not empty
                            setResponseRecv("");
                            setLoading(true);
                            setErrEmpty(false);
                            axios.post(`${backend_url}/login`, {
                                username: username,
                                password: password
                            })
                                .then((resp) => {
                                    const token = (resp as AxiosResponse<{ token: string }>).data.token;
                                    setLoading(false);
                                    const current_time = Math.floor(new Date().getTime() / 1000);
                                    // refresh token when it expires
                                    setTimeout(() => refreshToken(username, password), 
                                        (parseJwt(token).exp - current_time) * 1000);
                                    dispatch(setToken(token));
                                    dispatch(setIsMedic(parseJwt(token)?.isMedic === 'Y'));
                                })
                                .catch((errorResp) => {
                                    const errMsg = (errorResp as AxiosError<BackendError>).response.data
                                        .errors[0].message;
                                    setLoading(false);
                                    setResponseRecv(errMsg);

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
                    Log in
                </Text>
            </TouchableOpacity>
        </View>
    )

}
export default Login;
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
import { selectServerAddress, setCurrentAccountFullName, setCurrentAccountUsername, setServerAddress, setToken, setTokenRefreshRef } from '../../../features/globalStateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BackendError } from '../../../../Backend/src/errors/BackendError.error';
import { parseJwt } from '../../../utils/helper';
import DialogInput from 'react-native-dialog-input';

global.Buffer = global.Buffer || require('buffer').Buffer;

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

    serverButton: {
        position: 'absolute',
        right: "5%",
        bottom: "3%",
        elevation: 5,
        backgroundColor: 'lightblue',
        padding: 5,
        borderRadius: 10
    }
})

function Login(props: { passSignUp: () => void }) {
    const dispatch = useDispatch();
    const serverAddress = useSelector(selectServerAddress);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errUsername, setErrUsername] = useState("");
    const [errEmpty, setErrEmpty] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseRecv, setResponseRecv] = useState("");
    let focusPass = useRef(null);
    const refreshToken = (username: string, password: string) => {
        axios.post(`${serverAddress}/auth/login`, {
            username: username,
            password: password
        })
            .then((resp) => {
                const respData = (resp as AxiosResponse<{ token: string, fullName: string }>).data;
                const token = respData.token;
                if(parseJwt(token)?.role === "proxy")
                    return;
                const fullName = respData.fullName;
                const current_time = Math.floor(new Date().getTime() / 1000);
                dispatch(setCurrentAccountFullName(fullName));
                // refresh token when it expires
                dispatch(
                    setTokenRefreshRef(
                        setTimeout(
                            () => refreshToken(username, password),
                            (parseJwt(token).exp - current_time) * 1000
                        )
                    )
                );
                dispatch(setToken(token));
            })
            .catch((errorResp) => {                
                const errMsg = (errorResp as AxiosError<BackendError>).response?.data
                    .message;
                setLoading(false);
                setResponseRecv(errMsg || "Problem connecting to server.");
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
                            axios.post(`${serverAddress}/auth/login`, {
                                username: username,
                                password: password
                            })
                                .then((resp) => {
                                    const respData = (resp as AxiosResponse<{ token: string, fullName: string }>).data;
                                    const token = respData.token;
                                    if(parseJwt(token)?.role === "proxy")
                                        return;
                                    setLoading(false);
                                    const current_time = Math.floor(new Date().getTime() / 1000);
                                    // refresh token when it expires
                                    dispatch(setCurrentAccountUsername(username));
                                    dispatch(
                                        setTokenRefreshRef(
                                            setTimeout(
                                                () => refreshToken(username, password),
                                                (parseJwt(token).exp - current_time) * 1000
                                            )
                                        )
                                    );
                                    dispatch(setCurrentAccountFullName(respData.fullName));
                                    dispatch(setToken(token));
                                })
                                .catch((errorResp) => {
                                    const errMsg = (errorResp as AxiosError<BackendError>).response?.data
                                        .message;
                                    setLoading(false);
                                    setResponseRecv(errMsg || "Problem connecting to server.");

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
            <TouchableOpacity
                style={styles.serverButton}
                onPress={() => setIsDialogVisible(true)}
            >
                <Text>
                    Server
                </Text>
            </TouchableOpacity>
            <DialogInput isDialogVisible={isDialogVisible}
                title={"Server IP"}
                submitInput={(inputText) => {
                    dispatch(setServerAddress(`http://${inputText}:8000`));
                    setIsDialogVisible(false);
                }}
                closeDialog={() => { setIsDialogVisible(false) }}>
            </DialogInput>
        </View>
    )

}
export default Login;
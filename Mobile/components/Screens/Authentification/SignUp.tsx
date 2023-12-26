import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Picker } from '@react-native-picker/picker';
import { backend_url } from '../../../configs/backend_url';
import { textSize, marginBottom, auth_styles } from './auth_styles';
import { BackendError } from '../../../../Backend/src/errors/BackendError.error';


const styles = StyleSheet.create({
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
    }
});

function SignUp(props) {
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
    const [loading, setLoading] = useState(false);
    const [responseRecv, setResponseRecv] = useState({msg: "", ok: true});
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
            style={auth_styles.mainView}
        >
            <Text
                style={auth_styles.authText}
            >
                Sign up
            </Text>
            <TextInput
                style={[auth_styles.textInput, { borderColor: errName ? 'red' : fullName ? 'lightblue' : 'lightgrey' }]}
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
            {errName && <Text style={auth_styles.error}>{errName}</Text>}
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
                            axios.post(`${backend_url}/register`, {
                                username: username,
                                email: email,
                                password: password,
                                isMedic: isMedic ? 'Y' : 'N'
                            })
                            .then((resp) => {
                                const msg = (resp as AxiosResponse<{ message: string }>).data.message;
                                setResponseRecv({msg: msg, ok: true});
                                setLoading(false);
                                
                            })
                            .catch((errorResp) => {
                                const errMsg = (errorResp as AxiosError<BackendError>).response.data
                                    .errors[0].message;
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
import {
    SafeAreaView,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRef, useState } from 'react';
import { PfpPicker } from './PfpPicker';
import { putPatientDetails } from '../../../../dataRequests/PatientData';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setAccountDetails } from '../../../../features/globalStateSlice';
import { BackendError } from '../../../../../Backend/src/errors/BackendError.error';
import { AxiosError } from 'axios';

const reallyNiceBlue = "#2F80ED";

const styles = StyleSheet.create({
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
        // justifyContent: 'center',
        padding: 10
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
        padding: 5
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

export function PersonalDataForm(props) {
    const token = useSelector(selectToken);
    const dispatch = useDispatch();

    const [errFullName, setErrFullName] = useState("");
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errPut, setErrPut] = useState("");
    const [errEmpty, setErrEmpty] = useState("");
    const [savedGender, setSavedGender] = useState("M");
    const [profile_pic, setProfilePic] = useState("");

    let refGenderPicker = useRef(null);
    let refAge = useRef(null);

    const handleOpenPickerGender = () => {
        refGenderPicker.current.focus();
    };
    return (
        <SafeAreaView
            style={styles.mainView}
        >
            <Text
                style={styles.detailsText}
            >
                We'll need a few more details
            </Text>
            <View
                style={styles.personalDataView}
            >
                <PfpPicker
                    setPfpData={setProfilePic}
                    imageViewStyle={styles.imageView}
                    imageStyle={styles.image}
                />
                <View
                    style={styles.formView}
                >
                    <TextInput
                        style={[styles.fullNameInput, { borderColor: errFullName ? 'red' : '#2F80ED' }]}
                        placeholder="Full name"
                        returnKeyType='next'
                        onChangeText={(txt) => {
                            const fname = txt.toLowerCase();
                            if (/^[a-z ,.'-]+\ [a-z ,.'-]+$/.test(fname)) {
                                setErrFullName("");
                                setErrEmpty("");
                                setFullName(fname);
                            }
                            else {
                                setFullName("");
                                setErrFullName("Format: <F_name> <L_name>");
                            }
                        }}
                        onSubmitEditing={() => {
                            if (errFullName === "")
                                refAge?.current.focus();
                        }}
                    />
                    {errFullName && <Text style={styles.error}>{errFullName}</Text>}
                    <TextInput
                        placeholder='Age'
                        keyboardType='numeric'
                        ref={refAge}
                        style={styles.ageInput}
                        onChangeText={(nr) => {
                            if (nr !== "") {
                                setAge(parseInt(nr));
                                setErrEmpty("");
                            }
                            else {
                                setAge(0);
                            }
                        }}
                    />
                    <TouchableOpacity
                        style={styles.genderButton}
                        onPress={handleOpenPickerGender}
                    >
                        <Text
                            style={styles.genderText}
                        >
                            {savedGender === 'M' ? 'Gentelman' : 'Lady'}
                        </Text>
                        <Picker
                            mode='dialog'
                            style={{
                                display: 'none',
                                opacity: 0
                            }}
                            ref={refGenderPicker}
                            selectedValue={savedGender}
                            onValueChange={(gender: string, itemIndex) => {
                                setSavedGender(gender)
                            }}
                        >
                            <Picker.Item label="Gentleman" value={'M'} />
                            <Picker.Item label="Lady" value={'F'} />
                        </Picker>
                    </TouchableOpacity>
                </View>
            </View>
            {loading && <Text style={styles.loading}>Sending data...</Text>}
            {errPut !== "" && <Text style={styles.error}>{errPut}</Text>}
            {errEmpty !== "" && <Text style={styles.error}>{errEmpty}</Text>}
            <TouchableOpacity
                disabled={errEmpty ? true : false}
                style={[styles.submitButton, { backgroundColor: errEmpty ? 'lightgrey' : '#33b249' }]}
                onPress={() => {
                    setLoading(true);
                    if (errEmpty === "" &&
                        errFullName === "")
                        // no errors
                        if (fullName !== "" && age !== 0) {
                            // it's not empty
                            setErrEmpty("");
                            putPatientDetails(token, {
                                fullName: fullName,
                                age: age,
                                gender: savedGender,
                                profile_picB64: profile_pic
                            })
                            .then(() => {
                                setLoading(false);
                                dispatch(setAccountDetails({
                                    fullName: fullName,
                                    sex: savedGender,
                                    age: age,
                                }));
                            })
                            .catch((errorResp) => {
                                const errMsg = (errorResp as AxiosError<BackendError>).response.data
                                    .errors[0].message;
                                setLoading(false);
                                setErrPut(errMsg);

                            })
                        }
                        else {
                            setLoading(false);
                            setErrEmpty("All fields are required!");
                        }
                }}
            >
                <Text
                    style={styles.submitButtonText}
                >
                    Submit
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
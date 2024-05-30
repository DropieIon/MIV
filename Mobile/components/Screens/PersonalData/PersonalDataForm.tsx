import {
    SafeAreaView,
    TextInput,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState } from 'react';
import { PfpPicker } from './PfpPicker';
import { changePatientDetails, getDetails } from '../../../dataRequests/PatientData';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAccountFullName, selectCurrentAccountUsername, selectToken, setCurrentAccountFullName } from '../../../features/globalStateSlice';
import { BackendError } from '../../../../Backend/src/errors/BackendError.error';
import { AxiosError } from 'axios';
import { PDStyles } from './PDStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { accountDetails } from '../../../../Common/types';

type propsTemplate = {
    type: 'acc_data' | 'settings'
}

export function PersonalDataForm(props: propsTemplate) {
    const token = useSelector(selectToken);
    const dispatch = useDispatch();
    const currentFullName = useSelector(selectCurrentAccountFullName);
    const isSettingsScreen = props.type === "settings";

    const [initialDataLoading, setInitialDataLoading] = useState(true);
    const [errFullName, setErrFullName] = useState("");
    const [fullName, setFullName] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthday, setBirthday] = useState<Date>(null);
    const [loading, setLoading] = useState(false);
    const [errPut, setErrPut] = useState("");
    const [errEmpty, setErrEmpty] = useState("");
    const [savedGender, setSavedGender] = useState("M");
    const [profile_pic, setProfilePic] = useState("");
    const shouldRender = (!isSettingsScreen || (isSettingsScreen && !initialDataLoading));

    let refGenderPicker = useRef(null);
    useEffect(() => {
        setErrEmpty("");
    }, [profile_pic]);

    useEffect(() => {
        if (isSettingsScreen) {
            getDetails(token)
                .then((data: accountDetails) => {
                    setInitialDataLoading(false);
                    setProfilePic(data.pfp);
                    setSavedGender(data.sex);
                    setFullName(data.fullName);
                    setBirthday(new Date(data.birthday));
                });
        }
    }, [])

    const handleOpenPickerGender = () => {
        refGenderPicker.current.focus();
    };
    const saveDate = (event, selectedDate) => {
        setShowDatePicker(false);
        setBirthday(selectedDate);
    };
    return (
        <SafeAreaView
            style={PDStyles.mainView}
        >
            {!isSettingsScreen &&
                <Text
                    style={PDStyles.detailsText}
                >
                    We'll need a few more details
                </Text>}
            {shouldRender &&
                <View
                    style={PDStyles.personalDataView}
                >
                    <PfpPicker
                        setPfpData={setProfilePic}
                        imageViewStyle={PDStyles.imageView}
                        imageStyle={PDStyles.image}
                        isSettingsScreen={isSettingsScreen}
                        pfp={profile_pic}
                    />
                    <View
                        style={PDStyles.formView}
                    >
                        <TextInput
                            style={[PDStyles.fullNameInput, { borderColor: errFullName ? 'red' : '#2F80ED' }]}
                            placeholder={isSettingsScreen ? currentFullName : "Full name"}
                            returnKeyType='done'
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
                        />
                        {errFullName && <Text style={PDStyles.error}>{errFullName}</Text>}
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={PDStyles.pickBirthdayButton}
                        >
                            <Text
                                style={PDStyles.BirthdayText}
                            >
                                {!birthday ? "Birthday" : birthday.toDateString()}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker &&
                            <DateTimePicker
                                value={new Date()}
                                mode={'date'}
                                is24Hour={true}
                                onChange={saveDate}
                            />}
                        <TouchableOpacity
                            style={PDStyles.genderButton}
                            onPress={handleOpenPickerGender}
                        >
                            <Text
                                style={PDStyles.genderText}
                            >
                                {savedGender === 'M' ? 'Gentleman' : 'Lady'}
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
                </View>}
            {loading && <Text style={PDStyles.loading}>Sending data...</Text>}
            {errPut !== "" && <Text style={PDStyles.error}>{errPut}</Text>}
            {errEmpty !== "" && <Text style={PDStyles.error}>{errEmpty}</Text>}
            {shouldRender &&
                <TouchableOpacity
                    disabled={errEmpty ? true : false}
                    style={[PDStyles.submitButton, { backgroundColor: errEmpty ? 'lightgrey' : '#33b249' }]}
                    onPress={() => {
                        if (errEmpty === "" &&
                            errFullName === "" && profile_pic.length !== 0) {
                            setLoading(true);
                            // no errors
                            if (fullName !== "" && birthday && profile_pic !== "") {
                                // it's not empty
                                setErrEmpty("");
                                changePatientDetails(token, {
                                    fullName: fullName,
                                    birthday: birthday.toLocaleDateString(),
                                    gender: savedGender,
                                    profile_picB64: profile_pic
                                }, !isSettingsScreen)
                                    .then(() => {
                                        dispatch(setCurrentAccountFullName(fullName));
                                        setLoading(false);
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
                        }

                    }}
                >
                    <Text
                        style={PDStyles.submitButtonText}
                    >
                        {isSettingsScreen ? 'Update' : 'Submit'}
                    </Text>
                </TouchableOpacity>}
        </SafeAreaView>
    );
}
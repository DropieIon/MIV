import { SafeAreaView } from "react-native";
import Login from "./Login";
import SignUp from "./SignUp";
import React, { useState } from "react";
import { BackHandler } from 'react-native';


export default function Authentication(props) {
    const handleBackButtonClick = () => {
        setDesiresSignUp(false);
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        return true;
    }
    const [desiresSignUp, setDesiresSignUp] = useState(false);
    const passSignUp = () => {
        setDesiresSignUp(true);
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    };
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            {desiresSignUp && <SignUp setDesiresSignUp={setDesiresSignUp} />}
            {!desiresSignUp && <Login passSignUp={passSignUp} />}
        </SafeAreaView>
    )
}
import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { parseJwt } from '../../../../utils/helper';
import { useSelector } from 'react-redux';
import { selectToken } from '../../../../features/globalStateSlice';
import * as DocumentPicker from 'expo-document-picker';

const styles = StyleSheet.create({
    button_view: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        alignSelf: 'flex-end',
        top: "90%",
        right: "3%",
        borderRadius: 10,
        backgroundColor: '#2F80ED',
        height: "5%",
    },
    buttonText: {
        textAlignVertical: 'center',
        color: 'white',
        height: "100%",
        paddingEnd: 10,
    },
    buttonPlus: {
        padding: 10,
        verticalAlign: 'middle',
        left: "10%"
    }
});

type propsTemplate = {
    type: 'Patient' | 'Study',
    setZipData?,
    setErrUpload?,
    navigation
}

export function AddEntry(props: propsTemplate) {
    const token = useSelector(selectToken);
    const medic = parseJwt(token)?.role === 'med';
    return (
        <View
            style={[styles.button_view]}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: 'center'
                }}
                onPress={() => {
                    if(medic && props.type === 'Patient') {
                        props.navigation.navigate('All Patients');
                        return;
                    }
                    if(props.type === 'Study') {
                        if(!parseJwt(token)?.canUpload) {
                            props.setErrUpload("Cannot upload study");
                            return;
                        }
                        DocumentPicker.getDocumentAsync({
                            copyToCacheDirectory: true,
                            multiple: false
                        })
                        .then((data) => {
                            const { uri, size } = data.assets[0];
                            props.setZipData({
                                uri,
                                size
                            });
                        })
                        .catch((err) => {
                            console.error("Cannot get zip: ", err);
                        });
                        
                    }
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <AntDesign
                        name="plus"
                        size={15}
                        color="white"
                        style={styles.buttonPlus}
                    />
                    <Text
                        style={styles.buttonText}
                    >
                        Add
                    </Text>
                </View>

            </TouchableOpacity>

        </View>
    )
}
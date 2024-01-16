import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';

import ViewStyles from '../Templates/DefaultViewStyles';
import { AntDesign } from '@expo/vector-icons';


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
        width: "20%",
        height: "5%",
    },
    buttonText: {
        textAlignVertical: 'center',
        color: 'white',
        height: "90%",
        paddingStart: "17%",
        width: "100%",
    },
    buttonPlus: {
        verticalAlign: 'middle',
        left: "10%"
    }
})

export function AddEntry(props) {
    return (
        <View
            style={[styles.button_view]}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row'
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
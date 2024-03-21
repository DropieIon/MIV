import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';

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
                        flexDirection: 'row',
                        // backgroundColor: 'black'
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
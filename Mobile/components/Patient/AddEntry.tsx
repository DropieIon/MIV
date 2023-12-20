import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';

import ViewStyles from '../Templates/DefaultViewStyles';

const styles = StyleSheet.create({
    button_view: {
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'cyan'
    }
})

export function AddEntry(props) {
    return (
        <View
            style={[ViewStyles.item_img, styles.button_view]}
        >
            <TouchableOpacity>
                <Text
                    style={{textAlign: 'center'}}
                >
                    +
                </Text>

            </TouchableOpacity>

        </View>
    )
}
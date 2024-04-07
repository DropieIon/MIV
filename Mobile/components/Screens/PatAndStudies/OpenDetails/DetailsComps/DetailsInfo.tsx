import {
    View,
    Text
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { DetailsStyles, iconColor } from '../DetailsStyles';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectPatDetails } from '../../../../../features/globalStateSlice';
import { useEffect, useState } from 'react';

export function DetailsInfo(props) {
    const patDetails = useSelector(selectPatDetails);
    useEffect(() => {

    }, []);
    return (
        <View
            style={DetailsStyles.infoMainView}
        >
            <View
                style={DetailsStyles.infoIconAndTextContainer}
            >
                <AntDesign
                    style={[DetailsStyles.infoIcon, { flex: 5 }]}
                    name="user"
                    size={24}
                    color={iconColor}
                />
                <Text
                    style={DetailsStyles.infoText}
                >
                    {patDetails.sex === 'M' ? 'Man': 'Woman'}
                </Text>
            </View>
            <View
                style={DetailsStyles.infoIconAndTextContainer}
            >
                <Fontisto
                    style={DetailsStyles.infoIcon}
                    name="male"
                    size={24}
                    color={iconColor}
                />
                <Text
                    style={DetailsStyles.infoText}
                >
                    {patDetails.age === 1 ? `1 year` : `${patDetails.age} years`}
                </Text>
            </View>
            <View
                style={DetailsStyles.infoIconAndTextContainer}
            >
                <FontAwesome5
                    style={DetailsStyles.infoIcon}
                    name="file-medical"
                    size={24}
                    color={iconColor}
                />
                <Text
                    style={DetailsStyles.infoText}
                >
                    {patDetails.nrOfStudies === 1 ? `1 study` : `${patDetails.nrOfStudies} studies`}
                </Text>
            </View>
        </View>
    );
}
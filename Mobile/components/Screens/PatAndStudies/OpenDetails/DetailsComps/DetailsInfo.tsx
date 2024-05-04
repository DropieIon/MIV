import {
    View,
    Text
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { DetailsStyles, iconColor } from '../DetailsStyles';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectAccountDetails, selectToken } from '../../../../../features/globalStateSlice';
import { useEffect, useState } from 'react';
import { parseJwt } from '../../../../../utils/helper';

export function DetailsInfo(props) {
    const accountDetails = useSelector(selectAccountDetails);
    const token = useSelector(selectToken);
    const medic = parseJwt(token)?.role === 'med';
    return (
        <View
            style={DetailsStyles.infoMainView}
        >
            <View
                style={[DetailsStyles.infoIconAndTextContainer, medic ? {} : {width: "50%"}]}
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
                    {accountDetails.sex === 'M' ? 'Man': 'Woman'}
                </Text>
            </View>
            <View
                style={[DetailsStyles.infoIconAndTextContainer, medic ? {} : {width: "50%"}]}
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
                    {accountDetails.age === 1 ? `1 year` : `${accountDetails.age} years`}
                </Text>
            </View>
            <View
                style={[DetailsStyles.infoIconAndTextContainer, , medic ? {} : {display: 'none'}]}
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
                    {accountDetails.nrOfStudies === 1 ? `1 study` : `${accountDetails.nrOfStudies} studies`}
                </Text>
            </View>
        </View>
    );
}
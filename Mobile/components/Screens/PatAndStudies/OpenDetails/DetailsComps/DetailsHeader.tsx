import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import ViewStyles from '../../../../../components/ListStyles';
import { DetailsStyles } from '../DetailsStyles';
import { useSelector } from 'react-redux';
import { selectAccountDetails } from '../../../../../features/globalStateSlice';
import { defaultPfp } from '../../../../../configs/defaultUser.b64';
type propsTemplate = {
    setOpenDetails,
    type: 'PatsAssigned' | 'AllPats' | 'Study' | 'UnassignedStudies' | 'Requests' | 'My Requests'
}

export function DetailsHeader(props: propsTemplate) {
    const accountDetails = useSelector(selectAccountDetails);
    const noPfp = accountDetails.profile_pic === null;
    return (
        <View
            style={[DetailsStyles.headerMainViewNormal,
                props.type === 'PatsAssigned' ? DetailsStyles.headerMainViewPatsAssigned : {}
            ]}
        >
            <TouchableOpacity
                style={DetailsStyles.headercloseButton}
                onPress={() => {
                    props.setOpenDetails(false);
                }}
            >
                <AntDesign
                    name="closecircle"
                    size={24}
                    color="white"
                />
            </TouchableOpacity>
            <View
                style={DetailsStyles.headerImageTextContainer}
            >
                <Image
                    style={[ViewStyles.item_img, DetailsStyles.headerImage]}
                    source={{ uri: `data:image/jpeg;base64,${noPfp ? defaultPfp : accountDetails.profile_pic}` }} />
                <Text
                    style={DetailsStyles.headerFullName}
                >
                    {accountDetails.fullName}
                </Text>
            </View>
        </View>
    )
}
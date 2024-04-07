import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import ViewStyles from '@components/ListStyles';
import { DetailsStyles } from '../DetailsStyles';
import { useSelector } from 'react-redux';
import { selectPatDetails } from '../../../../../features/globalStateSlice';
import { defaultPfp } from '../../../../../configs/defaultUser.b64';
type propsTemplate = {
    setOpenDetails,
}

export function DetailsHeader(props: propsTemplate) {
    const patDetails = useSelector(selectPatDetails);
    const noPfp = patDetails.profile_pic === null;
    return (
        <View
            style={DetailsStyles.headerMainView}
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
                    source={{ uri: `data:image/jpeg;base64,${noPfp ? defaultPfp : patDetails.profile_pic}` }} />
                <Text
                    style={DetailsStyles.headerFullName}
                >
                    {patDetails.fullName}
                </Text>
            </View>
        </View>
    )
}
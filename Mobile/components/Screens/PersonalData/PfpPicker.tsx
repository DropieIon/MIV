import { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { defaultPfp } from '../../../configs/defaultUser.b64';

type propsTemplate = {
    imageViewStyle,
    imageStyle,
    setPfpData,
    isSettingsScreen: boolean,
    pfp?: string
}

export function PfpPicker(props: propsTemplate) {
    const [image, setImage] = useState(`data:image/jpeg;base64,${props.isSettingsScreen ? props.pfp : defaultPfp}`);
    
    // const [image, setImage] = useState(`data:image/jpeg;base64,${props.pfp}`);
    useEffect(() => {
        // we need to force trigger a refresh here
        if(props.isSettingsScreen)
            setImage(`data:image/jpeg;base64,${props.pfp}`);
    }, [props.pfp]);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            props.setPfpData(result.assets[0].base64);
        }
    };

    return (
        <View style={props.imageViewStyle}>
            <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: image }} style={props.imageStyle} />
            </TouchableOpacity>
        </View>
    );
}

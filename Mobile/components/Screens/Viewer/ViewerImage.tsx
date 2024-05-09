import React, {
    Dimensions,
    Text,
    StyleSheet
} from "react-native"
import { useEffect, useState } from "react"
import { Image } from 'expo-image';
import { imageListItem } from "../../../types/ListEntry";

const styles = StyleSheet.create({
    main_img: {
        alignSelf: 'center',
    },
    err_text: {
        flex: 1,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
})

export function ViewerImage(props: { onMount, series_data: imageListItem[] }) {
    const [img_nr, setImg_nr] = useState(0);
    useEffect(() => {
        props.onMount([img_nr, setImg_nr]);
    }, [props.onMount, img_nr]);
    // it has to fit
    const img_size = Math.min(
        Dimensions.get('window').height * 0.5, 
        Dimensions.get('window').width
    );
    const imgData = props.series_data[img_nr];
    if (props.series_data.length !== 0) {
        return (
            <Image
                style={[styles.main_img, { width: img_size, height: img_size}]}
                source={{
                    uri: `data:image/png;base64,${imgData?.data}`
                }}
                contentFit='contain'
            />
        )
    }
    return <Text style={styles.err_text}>No images.</Text>;
}

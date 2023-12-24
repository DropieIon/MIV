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
        alignSelf: 'center'
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
    const img_width = Dimensions.get('screen').width - 20;
    const imgData = props.series_data[img_nr];

    if (props.series_data.length !== 0) {
        return (
            <Image
                style={[styles.main_img, { width: img_width, height: img_width}]}
                source={{
                    uri: `data:image/png;base64,${imgData.data}`
                }}
            />
        )
    }
    return <Text style={styles.err_text}>No images.</Text>;
}

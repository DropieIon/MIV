import { useEffect, useState } from "react";
import { 
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    ViewStyle,
    Dimensions
} from "react-native";

type propsTemplate = {
    onMount,
    series_length: number,
    style: ViewStyle,
    chageImgNr: (img_nr: number) => void,
}

const textColor = 'white';
const fontSize = Dimensions.get('screen').fontScale * 30;

const styles = StyleSheet.create({
    arrow_button: {
        height: "100%",
        width: "20%",
        alignItems: 'center',
        color: textColor,
    },
    arrow: {
        height: "100%",
        width: "100%",
        textAlignVertical: 'center',
        textAlign: 'center',
        color: textColor,
        fontSize: fontSize,
    },
    status_nr: {
        fontWeight: 'bold',
        color: textColor,
        fontSize: fontSize,
    },
})

export function InstanceStatus(props: propsTemplate) {
    const [img_nr, setImg_nr] = useState(0);
    useEffect(() => {
        props.onMount([img_nr, setImg_nr]);
    }, [props.onMount, img_nr]);
    return (
        <View
            style={props.style}
        >
            <TouchableOpacity
                style={styles.arrow_button}
            >
                <Text
                    style={styles.arrow}
                    onPress={(e) => {
                        // left arrow
                        const new_img_nr = img_nr - ((img_nr === 0) ? 0 : 1);
                        setImg_nr(new_img_nr);
                        props.chageImgNr(new_img_nr);
                    }}
                >
                    &#60;
                </Text>
            </TouchableOpacity>
            <Text
                style={styles.status_nr}
            >
                {img_nr} / {props.series_length - 1}
            </Text>
            <TouchableOpacity
                style={styles.arrow_button}
                onPress={(e) => {
                    const new_img_nr = img_nr + ((img_nr === props.series_length - 1) ? 0 : 1);
                    setImg_nr(new_img_nr)
                    props.chageImgNr(new_img_nr);
                }}
            >
                <Text
                    style={styles.arrow}
                >
                    &#62;
                </Text>
            </TouchableOpacity>
        </View>
    )   
}
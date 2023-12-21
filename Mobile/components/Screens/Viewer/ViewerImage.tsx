import React, { Dimensions, View } from "react-native"
import { imageListItem } from "../../../types/ListEntry"
import { useEffect, useState } from "react"
import { orthanc_url } from "../../../configs/backend_url"
import { useSelector } from "react-redux"
import { selectToken } from "../../../features/globalStateSlice"
import { Image } from 'expo-image';


type propsTemplate = {
    all_data: imageListItem[],
    img_nr: number
}

export function ViewerImage(props: { onMount, all_data: imageListItem[] }) {
    const [img_nr, setImg_nr] = useState(0);
    const token = useSelector(selectToken);
    useEffect(() => {
        props.onMount([img_nr, setImg_nr]);
    }, [props.onMount, img_nr]);
    useEffect(() => {
        // prerender images
        // for (let i = 0; i < props.all_data.length; i++)
        //     Image.prefetch(`${orthanc_url}/instances/${props.all_data[i].data}/rendered`);
    }, [])
    const img_width = Dimensions.get('screen').width - 20;
    
    return (
        // <Image
        //     style={{ width: img_width, height: img_width, alignSelf: 'center' }}
        //     source={{ 
        //         uri: `${orthanc_url}/instances/${props.all_data[img_nr].data}/rendered`,
        //         headers: {Authorization: `Bearer ${token}`}
        //     }}
        // />
        <Image
            style={{ width: img_width, height: img_width, alignSelf: 'center' }}
            source={{ 
                uri: `data:image/png;base64,${props.all_data[img_nr].data}`
            }}
        />
    )
}

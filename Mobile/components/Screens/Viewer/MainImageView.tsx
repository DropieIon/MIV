import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    FlatList,
} from "react-native";
import { ViewerImage } from "./ViewerImage";
import { useEffect, useRef, useState } from "react";
import { imageListItem } from "../../../types/ListEntry";

const styles = StyleSheet.create({
    main_screen: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center'
    },
    img_scroll: {
        top: "22%",
        height: "78%",
        width: "100%",
        opacity: 0,
        position: 'absolute',
        zIndex: 100
    },
    loading_text_view: {
        flex: 1,
        justifyContent: 'center',
    },
    loading_text: {
        textAlign: 'center',
        color: 'white'
    }
})

type propsTemplate = {
    // because this is a drawer screen item we have this syntax:
    route: {
        params: {
            seriesData: imageListItem[],
            uid: number
        }
    }
}

export function MainImageView(props: propsTemplate) {
    const series_data = props.route.params.seriesData;
    // TODO: implement loading functionality
    const [loading, setLoading] = useState(false);
    let nr_ref = useRef<FlatList>(null);
    let natural_scroll = useRef(true);
    let img_nr = null, setImg_nr = null;
    let currentOffset = 0;
    let index = 0;
    if(series_data)
    {

        return (
            <SafeAreaView
                style={styles.main_screen}
            >
                {!loading &&
                    <ViewerImage
                        series_data={series_data}
                        onMount={(childData) => {
                            img_nr = childData[0];
                            setImg_nr = childData[1];
                        }}
                    />
                }
                {!loading &&
                    <FlatList
                        data={Array.apply(null, {length: 30}).map(Number.call, String)}
                        keyExtractor={(item) => item.valueOf()}
                        renderItem={(item) => {
                            return <Text style={{ height: 100, width: 100 }}>{item.item}</Text>
                        }}
                        showsVerticalScrollIndicator={false}
                        ref={nr_ref}
                        style={styles.img_scroll}
                        onScrollEndDrag={(e) => {
                            nr_ref.current?.scrollToIndex({ index: 15, animated: false })
                            natural_scroll.current = false;
                        }}
                        scrollEventThrottle={100}
                        onScroll={(e) => {
                            if(natural_scroll.current)
                            {
                                const offset = e.nativeEvent.contentOffset.y
                                if (currentOffset > offset) {
                                    index -= (index <= 0 ? 0 : 1)
                                } else if (currentOffset < offset) {
                                    index += (index === 100 - 1 ? 0 : 1);
                                }
                                setImg_nr(Math.round(index / 100 * (series_data.length - 1)));
                                currentOffset = offset;
                            }
                            else
                                natural_scroll.current = true;
                        }}
    
                    />}
            </SafeAreaView>
        );
    }
    return (
        <Text>Oops</Text>
    )

}

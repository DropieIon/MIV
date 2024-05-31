import {
    Text,
    View,
} from 'react-native'
import { useSelector } from 'react-redux';
import { selectLoadingProgress } from '../../../features/globalStateSlice';

type propsTemplate = {
    index: number,
    length: number
}

export function LoadingSeriesBar(props: propsTemplate) {
    const loadingProgress = useSelector(selectLoadingProgress);
    let width_calculated: number = 0;
    const current_load = loadingProgress[props.index];
    if(current_load)
    {
        if(current_load === props.length)
        {
            width_calculated = 0;
        }
        else
            width_calculated = Math.round(current_load / props.length * 200);
    }
    return (
        <View
            style={{
                width: 200,
                height: 200,
                position: 'absolute',
                justifyContent: 'center',
                zIndex: 1
            }}
        >
            <Text
                style={{
                    flex:1,
                    textAlignVertical: 'top',
                    textAlign: 'right',
                    color: 'lightblue',
                    fontSize: 20,
                }}
            >
                {props.length}
            </Text>
            <Text
                style={{
                    height: 10,
                    backgroundColor: 'blue',
                    width: width_calculated,
                }}
            ></Text>
        </View>
    );
}
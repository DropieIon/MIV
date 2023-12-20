import { 
    StyleSheet,
    Dimensions
} from 'react-native';

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    item: {
        height: Dimensions.get('window').height / 18,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "black"
    },
    item_name: {
        width: "45%",
        height: "100%",
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    item_age: {
        width: "20%",
        height: "100%",
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    item_date: {
        width: "40%",
        height: "100%",
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    item_sex: {
        width: "20%",
        height: "100%",
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    item_img: {
        width: "15%",
        height: "100%",
    },
    searchBox: {
        left: "15%",
        width: "60%",
        height: "100%"
      },
})

export default styles;
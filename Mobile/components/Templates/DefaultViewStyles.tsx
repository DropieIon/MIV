import { 
    StyleSheet,
    Dimensions
} from 'react-native';

const styles = StyleSheet.create({
    list: {
        top: "5%",
        paddingRight: "2%",
        paddingLeft: "2%",
        flex: 1,
    },
    item: {
        height: Dimensions.get('window').height / 10,
        alignItems: 'center',
        paddingLeft: "5%",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#F1F1F1"
    },
    item_name: {
        width: "45%",
        height: "80%",
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    item_age: {
        width: "20%",
        height: "80%",
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    item_date: {
        width: "40%",
        height: "80%",
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    item_sex: {
        width: "17%",
        height: "80%",
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    item_img: {
        borderRadius: 10,
        width: "20%",
        height: "80%",
    },
    searchBox: {
        left: "15%",
        width: "60%",
        height: "100%"
      },
})

export default styles;
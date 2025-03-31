import {
    Modal,
    View,
    TouchableOpacity
} from "react-native";
import { uploadStyles } from "../AddEntry/UploadStyles";
import SearchBar from "../../../Search/SearchBar";
import List from "../../../List/List";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../../../features/globalStateSlice";
import { getPatients } from "../../../../dataRequests/PatientData";
import { ListEntry } from '../../../../types/ListEntry';
import { AntDesign } from '@expo/vector-icons';

type propsTemplate = {
    setOpenAssignment,
    setRefreshList,
}

export function AssignModal(props: propsTemplate) {
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(true);
    const items_list = useRef<ListEntry[]>([]);
    useEffect(() => {
        getPatients(token)
        .then((data) => {
            items_list.current = data;
            setLoading(false);
        })
    }, []);
    let filteredList;
    const [filter, setFilter] = useState("");
    if(filter !== "") {
        filteredList = items_list.current.filter((item) => {
            const toFilter = item.full_name;
            return (new RegExp(`^${filter.toLowerCase().replace('\\', '')}`)).test(toFilter.toLowerCase());
        })
    }
    else {
        filteredList = items_list.current;
    }
    return (
        <Modal
        animationType="fade"
        transparent={true}
        >
            <View
                style={uploadStyles.mainView}
            >
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        zIndex: 3,
                        right: "1%"
                    }}
                    onPress={() => {
                        props.setOpenAssignment(false);
                    }}
                >
                    <AntDesign
                        name="closecircle"
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
                <View
                    style={{
                        width: "100%",
                        height: "15%",
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <SearchBar
                        onChange={(text) => {
                            setFilter(text);
                        }}
                    />
                </View>
                    <List
                        template={'medic'}
                        viewPatientsType="assign_study"
                        navigation={{}}
                        items={filteredList}
                        setRefreshList={props.setRefreshList}
                        setOpenAssignment={props.setOpenAssignment}
                        listStudies={false}
                    />
            </View>
        </Modal>
    );
}
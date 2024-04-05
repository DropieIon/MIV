import {
    View,
    Modal,
} from 'react-native';
import { DetailsHeader } from './DetailsComps/DetailsHeader';
import { DetailsInfo } from './DetailsComps/DetailsInfo';
import { DetailsFooter } from './DetailsComps/DetailsFooter';

type propsTemplate = {
    setOpenDetails
}

export function DetailsModal(props: propsTemplate) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {

            }}>
            <View
                style={{
                    height: "30%",
                    top: "70%",
                    backgroundColor: 'red',
                    borderTopEndRadius: 50,
                    borderTopStartRadius: 50
                }}
            >
                <DetailsHeader
                    setOpenDetails={props.setOpenDetails}
                />
                <DetailsInfo />
                <DetailsFooter/>
            </View>
        </Modal>
    )
}
import {
    View,
    Modal
} from 'react-native';
import { DetailsHeader } from './DetailsComps/DetailsHeader';
import { DetailsInfo } from './DetailsComps/DetailsInfo';
import { DetailsFooter } from './DetailsComps/DetailsFooter';
import { DetailsStyles } from './DetailsStyles';

type propsTemplate = {
    setOpenDetails,
    setRefreshPatList
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
                style={DetailsStyles.modalMainView}
            >
                <DetailsHeader
                    setOpenDetails={props.setOpenDetails}
                />
                <DetailsInfo />
                <DetailsFooter
                    setOpenDetails={props.setOpenDetails}
                    setRefreshPatList={props.setRefreshPatList}
                />
            </View>
        </Modal>
    )
}
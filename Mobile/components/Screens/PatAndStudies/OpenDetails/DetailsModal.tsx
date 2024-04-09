import {
    View,
    Modal
} from 'react-native';
import { DetailsHeader } from './DetailsComps/DetailsHeader';
import { DetailsInfo } from './DetailsComps/DetailsInfo';
import { DetailsFooter } from './DetailsComps/DetailsFooter';
import { DetailsStyles } from './DetailsStyles';
import { DetailsPropsTemplate } from './PropsTemplate';

export function DetailsModal(props: DetailsPropsTemplate) {
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
                {props.type !== 'Requests' &&
                    <DetailsFooter
                        setOpenDetails={props.setOpenDetails}
                        setRefreshPatList={props.setRefreshPatList}
                        type={props.type}
                />}
            </View>
        </Modal>
    )
}
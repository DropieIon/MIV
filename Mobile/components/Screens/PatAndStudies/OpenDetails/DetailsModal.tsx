import {
    View,
    Modal
} from 'react-native';
import { DetailsHeader } from './DetailsComps/DetailsHeader';
import { DetailsInfo } from './DetailsComps/DetailsInfo';
import { DetailsFooter } from './DetailsComps/DetailsFooter';
import { DetailsStyles } from './DetailsStyles';
import { DetailsPropsTemplate } from './PropsTemplate';
import { useState } from 'react';
import Toast from 'react-native-root-toast';

export function DetailsModal(props: DetailsPropsTemplate) {
    const [respUnlim4h, setRespUnlim4h] = useState('');
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
        >
            <View
                style={[DetailsStyles.modalMainViewNormal,
                    props.type === 'PatsAssigned' ?
                    DetailsStyles.modalMainViewPatsAssigned : {}]}
            >
                <DetailsHeader
                    type={props.type}
                    setOpenDetails={props.setOpenDetails}
                />
                {props.type !== "Study" && <DetailsInfo />}
                {props.type !== 'Requests' &&
                    <DetailsFooter
                        setRespUnlim4h={setRespUnlim4h}
                        setOpenDetails={props.setOpenDetails}
                        setRefreshPatList={props.setRefreshPatList}
                        adminList={props.adminList}
                        type={props.type}
                />}
                <Toast
                    visible={respUnlim4h !== ''}
                    position={0}
                    onShow={() => {
                        setTimeout(() => {
                            setRespUnlim4h('');
                        }, 2000);
                    }}
                >
                    {respUnlim4h}
                </Toast>
            </View>
        </Modal>
    )
}
import React, {Component} from 'react';
import { 
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image
} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import {getViewerImages, getAllPatients} from './Data';


class Viewer extends Component {
    state = {
        loading: true,
        all_data: []
    };
    componentDidMount(): void {
    }
    render(): React.ReactNode {
        let images: Element[] = [];
        let key_id = 0;
        if (!this.state.loading) {
            images = this.state.all_data.map((data) => {
                return <Image key={key_id++} style={{ width: 200, height: 200 }} source={{ uri: `data:image/jpeg;base64,${data}` }}></Image>
            })
        }
        return (
            <View>

            </View>
        );
    }
}
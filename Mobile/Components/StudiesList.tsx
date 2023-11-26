import React, {Component} from 'react';
import { 
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  TouchableHighlight
} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import {getViewerImages, getAllPatients} from './Data';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
      marginBottom: 10,
    },
  });

class StudiesList extends Component {
    state = {
        loading: true,
        studies_list: []
    };
    handlePress() {
      console.log("Merge");
        
    }
    componentDidMount(): void {
    }
    render(): React.ReactNode {
        let images: React.JSX.Element[] = [];
        let key_id = 0;
        if (!this.state.loading) {
            images = this.state.studies_list.map((data) => {
                return <Image key={key_id++} style={{ width: 200, height: 200 }} source={{ uri: `data:image/jpeg;base64,${data}` }}></Image>
            })
        }
        return (
            <View
              style={{
                flexDirection: 'row',
                height: 100,
            }}
            >
              <TouchableHighlight style={{backgroundColor: 'lightblue', flex: 0.3}} onPress={this.handlePress}>
                <Text>Merge?</Text>
              </TouchableHighlight>

            </View>
        );
    }
}

export default StudiesList;
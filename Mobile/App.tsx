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


class App extends Component {
  state = {
    count: 0,
    loading: true
  };
  all_data:string[] =  [];
  
  apasat = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };
  componentDidMount(): void {
    getAllPatients().then( (patient_list) => {
      patient_list.forEach((patient_id) => {
        getViewerImages(patient_id).then((all_data) => {
          this.all_data = all_data;
          this.setState({loading: false});
        })
      });
    });
  }
  
  render(): React.ReactNode {
    // console.log(this.img_data);
    let images: Element[] = [];
    if(!this.state.loading)
    {
      let key_id = 0;
      images = this.all_data.map((data) => {
        return <Image key={key_id++} style={{ width: 200, height: 200 }} source={{ uri: `data:image/jpeg;base64,${data}` }}></Image>
    });
    }
    // console.log(images);
    return (
      <View style={styles.container}>
        <TouchableOpacity 
        style={styles.button}
        onPress={this.apasat}
        >
          <Text>Click me!</Text>
        </TouchableOpacity>
        {this.state.loading && <Text>loading...</Text>}
        {images}
        <Text>You clicked {this.state.count} times!</Text>
      </View>
    );
  }
};

export default App;
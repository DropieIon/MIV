import React, {Component, useState} from 'react';
import { 
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image
} from 'react-native';
import axios from 'axios';


function getInstance() {
  // not yet working
  axios.get("http://192.168.1.213:8042/instances/64020d5c-735a38ae-f3124c0c-2fa41e32-631ec3d1/frames/0/rendered",
    { headers: { 'Content-Type': 'image/jpeg' } }
  ).then(resp => {
    console.log(resp.data);
    

  })
}



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
    count: 0
  };
  
  apasat = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };
  componentDidMount(): void {
    getInstance();
  }
  
  render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
        style={styles.button}
        onPress={this.apasat}
        >
          <Text>Click me!</Text>
        </TouchableOpacity>
        {/* <Image source={ getInstance() }></Image> */}
        <Text>You clicked {this.state.count} times!</Text>
      </View>
    );
  }
};

export default App;
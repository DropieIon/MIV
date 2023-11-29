import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  Text
} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DefaultViewDoc from './Components/Doctor/DefaultViewDoc';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Components/Screens/Authentification/Login';
import SignUp from './Components/Screens/Authentification/SignUp';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Drawer = createDrawerNavigator();


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
    // console.log("Merge");
    
    // getAllPatients().then( (patient_list) => {
    //   patient_list.forEach((patient_id) => {
    //     getViewerImages(patient_id).then((all_data) => {
    //       this.all_data = all_data;
    //       this.setState({loading: false});
    //       this.forceUpdate();
    //     })
    //   });
    // });
  }
  
  render(): React.ReactNode {
    // console.log(this.img_data);
    let images: React.JSX.Element[] = [];
    if(!this.state.loading)
    {
      let key_id = 0;
      images = this.all_data.map((data) => {
        return <Image key={key_id++} style={{ width: 200, height: 200 }} source={{ uri: `data:image/jpeg;base64,${data}` }}></Image>
    });
    }
    // console.log(images);
    return (
      // <View style={styles.container}>
      <NavigationContainer>
        {/* <Login /> */}
        <SignUp/>
          {/* <TouchableOpacity 
          style={styles.button}
          onPress={this.apasat}
          >
            <Text>Click me!</Text>
          </TouchableOpacity> */}
          {/* <StatusBar style='auto'></StatusBar> */}
          {/* {this.state.loading && <Text>loading...</Text>} */}
          {/* {images} */}
          {/* <StudiesList></StudiesList> */}
          {/* <DefaultViewDoc /> */}
          {/* <Drawer.Navigator>
            <Drawer.Screen
              name='Patients'
              component={DefaultViewDoc} />
          </Drawer.Navigator> */}
        </NavigationContainer>
      // </View>
    );
  }
};

export default App;
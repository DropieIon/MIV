import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  Button
} from 'react-native';
// global.Buffer = global.Buffer || require('buffer').Buffer;
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './store';

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


function App(props) {
  const [loading, setLoading] = useState(true);
  let all_data: string[] = [];
  // const token = useSelector(selectToken);
  // const dispatch = useDispatch();

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
  return (
    // <View style={styles.container}>
    <Provider
      store={store}
    >
      <NavigationContainer>
        {/* <Button
          title='Jwt'
          onPress={(event) => {
            event.preventDefault();
            dispatch(jwtSlice.actions.setToken("da"))
          }}
        /> */}
        <SignUp />
      </NavigationContainer>
    </Provider>
    /* <Login /> */
    /* <Drawer.Navigator>
          <Drawer.Screen
            name='Patients'
            component={DefaultViewDoc} />
        </Drawer.Navigator> */
    // </View>
  );
}

export default App;
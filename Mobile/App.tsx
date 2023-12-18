import React, { useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
// global.Buffer = global.Buffer || require('buffer').Buffer;
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './store';
import { NavigationContainer } from '@react-navigation/native';
import Authentication from './components/Screens/Authentification/Authentication';
import { LandingScreen } from './components/Screens/LandingScreen/LandingScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


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
    <Provider
      store={store}
    >
      <NavigationContainer>
        <LandingScreen/>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
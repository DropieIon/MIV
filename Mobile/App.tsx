import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './store';
import { NavigationContainer } from '@react-navigation/native';
import { LandingScreen } from './components/Screens/LandingScreen/LandingScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


function App(props) {
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
import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
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
      {/* App needs this to display toasts */}
      <RootSiblingParent>
        <NavigationContainer>
          <LandingScreen />
        </NavigationContainer>
      </RootSiblingParent>
    </Provider>
  );
}

export default App;
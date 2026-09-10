import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import store from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true); // Ignore all log notifications 

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
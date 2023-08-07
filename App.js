import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import StackNavigation from './src/navigators/StackNavigation';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import { store } from './src/redux/Store';

const App = () => {
  return (
    <Provider store={store}>
      <StackNavigation />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});

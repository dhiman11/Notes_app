import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { StyleSheet, Text, View, StatusBar,AsyncStorage } from 'react-native';

import Login from './Pages/Login';
import Home_page from './Pages/Home_page';

let  token  =    AsyncStorage.getItem('cookies');
 
const AppStack = createStackNavigator(
  {
    Home: Home_page
  }, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
}
);
const AuthStack = createStackNavigator(
  {
    SignIn: Login
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

////////////////////////////////////// 
const AppContainer  =  createAppContainer(createStackNavigator(
  {
    // AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
));




export default class App extends React.Component {
 
  render() {
    return (
      <AppContainer   screenProps={this.props.navigation}  />
    );
  }
}



//import liraries
import React, { Component } from 'react';
import {StyleSheet,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';
 
import Add_events from './add_notes/Add_events';
import Add_suppliers from './add_notes/Add_suppliers';
import Explore_data from './add_notes/Explore_data';
 
 

const AppNavigator = createStackNavigator({
    Add_events: {
      screen: Add_events,
    },
    Add_supp:{
      screen: Add_suppliers
    },
    Explore_data:{
      screen: Explore_data
    }
  }, {
      initialRouteName: 'Add_events',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
  });


//make this component available to the app
export default AppNavigator;

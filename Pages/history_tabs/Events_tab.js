//import liraries
import React, { Component } from 'react';
import {StyleSheet,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';

/////////////// 
 
import Products_tab_data from './Product_tab_data';
import Edit_product from '../edit_note/Edit_product';
import Events_tab_data from './Events_tab_data';
import Add_suppliers from '../add_notes/Add_suppliers';
 
 
///////////////

const AppNavigator = createStackNavigator({
    Events_tab_data: {
      screen: Events_tab_data,
    },
    Edit_event_here: {
      screen: Add_suppliers,
    } 
  }, {
      initialRouteName: 'Events_tab_data',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
  });


//make this component available to the app
export default AppNavigator;

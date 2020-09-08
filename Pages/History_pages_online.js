//import liraries
import React, { Component } from 'react';
import {StyleSheet,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import History_online from './History_online';
import Edit_product from './edit_note/Edit_product';
import Edit_contact from './edit_note/Edit_contact';
import Add_suppliers from './add_notes/Add_suppliers';
import Explore_data from './add_notes/Explore_data';
///////////////
 
///////////////

const AppNavigator = createStackNavigator({
    History: {
      screen: History_online,
    },
    Edit_p: {
      screen: Edit_product,
    },
    Edit_c: {
      screen: Edit_contact,
    },
    Add_suppliers: {
      screen: Add_suppliers,
    },
    Explore_data: {
      screen: Explore_data,
    }
  
  }, {
      initialRouteName: 'History',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
  });


//make this component available to the app
export default AppNavigator;

//import liraries
import React, { Component } from 'react';
import {StyleSheet,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';

///////////////
import Pro_con_data from './explorer_data/Pro_con_data';
import Edit_product from '../edit_note/Edit_product';
import Edit_contact from '../edit_note/Edit_contact';
 
///////////////
///////////////

const AppNavigator = createStackNavigator({
    Pro_con_data: {
      screen: Pro_con_data,
    },
    Edit_product: {
      screen: Edit_product,
    },
    Edit_contact: {
      screen: Edit_contact,
    }
  
  }, {
      initialRouteName: 'Pro_con_data',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
  });


//make this component available to the app
export default AppNavigator;

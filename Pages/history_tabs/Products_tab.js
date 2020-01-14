//import liraries
import React, { Component } from 'react';
import {StyleSheet,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';

/////////////// 

import Products_tab_data from './Product_tab_data';
import Edit_product from '../edit_note/Edit_product';

 
///////////////

const AppNavigator = createStackNavigator({
    product_tab: {
      screen: Products_tab_data,
    },
    Edit_product: {
      screen: Edit_product,
    } 
  }, {
      initialRouteName: 'product_tab',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
  });


//make this component available to the app
export default AppNavigator;

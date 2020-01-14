//import liraries
import React, { Component } from 'react';
import {StyleSheet,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';

/////////////// 

 
import Edit_product from '../edit_note/Edit_product';
import Product_offline_data from './Product_offline_data';
 

 
///////////////

const AppNavigator = createStackNavigator({
    Product_offline_data: {
      screen: Product_offline_data,
    },
    Edit_product: {
      screen: Edit_product,
    } 
  }, {
      initialRouteName: 'Product_offline_data',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
  });


//make this component available to the app
export default AppNavigator;

//import liraries
import React, { Component } from 'react';
import {StyleSheet,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';

/////////////// 

import Contacts_tab_data from './Contact_tab_data';
import Edit_contact from '../edit_note/Edit_contact';

 
///////////////

const AppNavigator = createStackNavigator({
    contact_tab: {
      screen: Contacts_tab_data,
    },
    Edit_contact: {
      screen: Edit_contact,
    } 
  }, {
      initialRouteName: 'contact_tab',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
  });


//make this component available to the app
export default AppNavigator;

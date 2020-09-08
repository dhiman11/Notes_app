import React, { Component } from 'react';
import { View, Text, StyleSheet,NetInfo  } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
 


///////////  ALL TABS //////////////////////////////
////////////////////////////////////////////////////
import Product_online from './product_tabs/Product_online'; 
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


const Appli = createMaterialTopTabNavigator(
	{
 
		Products: {
			screen: Product_online,
			navigationOptions: {
				tabBarIcon: ({ focused, tintColor }) => {
					const iconFocused = focused ? '#7444C0' : '#363636';
					return (  
                        <View><Image 
                        style ={{width:25,height:25}}
                        source={require('../assets/img/search.png')}
                         /></View>
					);
				}
			}
		}
    
 
	},
	{
		initialRouteName:"Products"
	},
	{
		tabBarOptions: {
           
			activeTintColor: 'red',
			inactiveTintColor: 'pink',
		 
			style: {
				backgroundColor: '#fff',
				borderTopWidth: 0,
				paddingVertical: 0,
				height: 100, 
				marginTop: 20,
				shadowOpacity: 0.05,
				shadowRadius: 0,
				shadowColor: '#000',
				shadowOffset: { height: 0, width: 0 }
			}
		}
	}
);



export default Appli;


 
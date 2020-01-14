import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'; 
import { createMaterialTopTabNavigator } from 'react-navigation';

///////////  ALL TABS //////////////////////////////
////////////////////////////////////////////////////
import Events_tab from './history_tabs/Events_tab';
import Suppliers_tab from './history_tabs/Suppliers_tab';
import Contacts_tab from './history_tabs/Contacts_tab';
import Products_tab from './history_tabs/Products_tab';
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
 

const Appli = createMaterialTopTabNavigator(
	{
		Events: {
			screen: Events_tab, 
			navigationOptions: { 
				tabBarLabel: 'Events',
				tabBarIcon: ({ focused, tintColor }) => {
					const iconFocused = focused ? '#7444C0' : '#363636';
					return (
						<View> <Text>lol</Text></View>
					);
				}
			}
		},
		Suppliers: {
			screen: Suppliers_tab,
			navigationOptions: {
				tabBarLabel: 'Suppliers',
				tabBarIcon: ({ focused, tintColor }) => {
					const iconFocused = focused ? '#7444C0' : '#363636';
					return (
						<View> <Text> </Text></View>
					);
				}
			}
		},
		Contacts: {
			screen: Contacts_tab,
			navigationOptions: {
				tabBarLabel: 'Contacts',
				backgroundColor:"red", 
				tabBarIcon: ({ focused, tintColor }) => {
					const iconFocused = focused ? '#7444C0' : '#363636';
					return (
						<View> <Text> </Text></View>
					);
				}
			}
		},
		Products_tab: {
			screen: Products_tab,
			navigationOptions: {
				tabBarLabel: 'Products',
				tabBarIcon: ({ focused, tintColor }) => {
					const iconFocused = focused ? '#7444C0' : '#363636';
					return (
						<View> <Text> </Text></View>
					);
				}
			}
		}

	},
	{
		initialRouteName: "Events", 
		tabBarOptions: { 
			labelStyle: {
				fontSize: 10,
			  },
			activeTintColor: "#fff",
            inactiveTintColor: "#000000",
			inactiveBackgroundColor: '#000000',
			indicatorStyle: {
                height: null,
				top: 0,
				fontSize:10,
				backgroundColor: '#166fc1', 
				borderBottomColor: "#fff200",
				borderBottomWidth: 5,
				fontSize:10
			},
			style: { 
				backgroundColor: "#fff", 
				color: "black", 
				fontSize:10
            },
		},


	}
);


 
export default Appli;

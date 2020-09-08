//import liraries
import React from 'react';
import { View, Text, StyleSheet, Image, AsyncStorage } from 'react-native';

import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

// create a component
import History_pages from './History_pages';
import Add_note from './Add_note';
import Products from './Products';
import History_pages_online from './History_pages_online';
import { FontAwesome, Entypo,SimpleLineIcons } from '@expo/vector-icons';
import User from './User';

 

const Appli = createBottomTabNavigator(
	{
		Products: {
			screen: Products,
			navigationOptions: {
				title: 'All products',
				tabBarIcon: ({ focused, tintColor }) => {
					return (
						<View>
							<FontAwesome name="search" size={25} color="#000000" />
						</View>
					);
				}
			}
		},

		History: {
			screen: History_pages,
			navigationOptions: {
				title: 'My Notes',
				tabBarIcon: ({ focused, tintColor }) => {
					return (
						<View>
							<SimpleLineIcons name="note" size={25} color="#000000" />
						</View>
					);
				}
			}
		},
		Add: {
			screen: Add_note,
			navigationOptions: {
				title: 'Add Note',
				tabBarIcon: ({ focused, tintColor }) => {
					return (
						<View>
							<Entypo name="plus" size={40} color="#000000" />
						</View>
					);
				}
			}
		},
		Timeline: {
			screen: History_pages_online,
			navigationOptions: {
				title: 'History',
				tabBarIcon: ({ focused, tintColor }) => {
					return (
						<View>
							<FontAwesome name="history" size={25} color="#000000" />
						</View>
					);
				}
			}
		},
		Users: {
			screen: User,
			navigationOptions: {
				title: 'Me',
				tabBarIcon: ({ focused, tintColor }) => {
					return (
						<View>
							<FontAwesome name="user-circle" size={25} color="#000000" />
						</View>
					);
				}
			}
		}

	},
	{
		initialRouteName: "Add",

		tabBarOptions: {
			activeTintColor: '#fff',
			inactiveTintColor: '#000000',
			activeBackgroundColor: "#2e75b6",
			indicatorStyle: {
				height: null,
				top: 0,
				backgroundColor: 'red',

			},
		},
	},

);

const styles = StyleSheet.create({
	tabButton: {
		paddingTop: 0,
		paddingBottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1
	},
	tabButtonText: {
		textTransform: 'uppercase'
	},
	icon: {
		fontFamily: 'Arial',
		height: 30,
		fontSize: 25,
		paddingBottom: 0
	}
});





const Mainmenu = createAppContainer(Appli);



export default class Home_page extends React.Component {
	///////////////////////////
	///////////////////////////
	constructor(props) {
		super(props);

		this.state = {
			logged_in: false
		}
		this._bootstrapAsync(props);
	}

	componentDidMount(){
		this.props.navigation.addListener('willFocus', (route) => {
            this.ifloginalerady();
        });
	}
	

	_bootstrapAsync = async (props) => {
		const userToken = await AsyncStorage.getItem('cookies');
		try {
			token = JSON.parse(userToken);
			//////////////////////////////
			this.setState({
				logged_in: token.logged_in
			});

		} catch (error) {


		}
		// This will switch to the App screen or Auth screen and this loading
		// screen will be unmounted and thrown away.

	};


	///////////////////////////
	///////////////////////////
	render() {
		this.ifloginalerady();
		return (
			<Mainmenu screenProps={this.props.navigation} />
		);

	}
	///////////////////////////
	///////////////////////////


	      ifloginalerady = async()=>{
          try {
                let  token  =  await AsyncStorage.getItem('cookies');
                let data  = JSON.parse(token);
                if(data.logged_in){
                    this.props.navigation.navigate('App');
                }else{
                    this.props.navigation.navigate('Auth');
                }

          } catch (error) {
              
          }
	  }
	  
}

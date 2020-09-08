import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';

import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
import Event_compo from '../History_components/Event_compo';
import { load_events } from '../models/all_models';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { cookies } from '../Settings';
 

export default class Events_tab_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events_data: [],
            loadmore_test: '',
            isRefreshing: false,
            loadingmore: false,
            history_array: [],
            limit: 0,
            user_id:null
        };
    }

    componentDidMount = async() => {
         await this.get_data();
        this.props.navigation.addListener('willFocus', (route) => {
            this._onRefresh();
        });

     

    }

    process_data = (rows) => {

        this.setState({
            events_data: [...this.state.events_data, ...rows],
            loadingmore: false
        })

        // console.log(this.state.events_data);
    }

    get_data = async(limit = 0) => { 
       
        console.log(cookies);
        await cookies.then((obj)  => {
            var data =     JSON.parse(obj);  
            console.log(data);
            this.setState({
                user_id:data.user_id
            })   
         }); 
       await load_events(limit,this.state.user_id).then((response) => {  
            var event_data   = JSON.parse(response);
            // console.log(event_data);
            this.process_data(event_data.event_list_all)
          
        }); 

    }

    _onRefresh = () => {
        this.setState({ isRefreshing: true })
        this.setState({ events_data: [] })
        this.setState({ limit: 0 })
        this.get_data(0);
        this.setState({ isRefreshing: false })
        this.setState({ loadmore_test: ' ', });
    }

    ///// LOAD MORE ////////////////////
    handleLoadMore = () => {

        this.setState({ loadmore_test: 'Loading...', });
        var limit = parseInt(this.state.limit) + parseInt(20);  // increase page by 1
        this.setState({ limit: limit });
        this.get_data(limit);  // method for API call 
        this.setState({ loadmore_test: 'Scroll down to load more', });

    };

 

    edit_it = (id,name='') => {
       
        this.props.navigation.navigate('Add_suppliers', {
            event_id: id,
            event_name: name
        });


    }

    render() {
        return (
            <View style={styles.container}>

                {this.state.loadingmore &&
                    <ActivityIndicator animating={this.state.loadingmore} size="large" color="red" />
                }
                <FlatList
                    numColumns={1}
                    data={this.state.events_data}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={3}
                    onEndReached={this.handleLoadMore.bind(this)}
                    renderItem={({ item, index }) => (



                        <View>
                            <TouchableOpacity onPress={() => {
                                    this.edit_it(item.event_id,item.event_name);
                                }}>
                                 <Event_compo event_name={item.event_name} city={item.city} />
                            </TouchableOpacity>
                        </View>

                    )}
                />

                <View>
                    <Text>{this.state.loadmore_test}</Text>
                </View>


            </View>

        );
    }

}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',


    },
    heading: {
        fontSize: 22,
        color: "#000000",
        marginTop: 10,
        width: 100,
        marginBottom: 20,
        fontWeight: "bold"
    }
});
import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList,RefreshControl,ActivityIndicator,TouchableOpacity } from 'react-native';

import { SQLite } from 'expo-sqlite'; 
const db = SQLite.openDatabase('db.db'); 
import Supplier_compo from '../History_components/Supplier_compo'; 
import { tabs_data_load } from '../models/all_models';
 

export default class Suppliers_tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suppliers_data: [],
            loadmore_test:'',
            isRefreshing:false,
            loadingmore:false, 
            history_array:[],
            limit:0,
        };
    }

    componentDidMount() {
        // this.get_data(this.state.limit);
        this.props.navigation.addListener('willFocus', (route) => {
          this._onRefresh();
          });
    }

    process_data=(rows)=>{
       
        this.setState({  
            suppliers_data:[...this.state.suppliers_data,...rows],
            loadingmore:false
        })
    }

    get_data = (limit,tabname='supplier') => {
      
        tabs_data_load(limit,tabname).then((response) => {  
            var data   = JSON.parse(response);
            console.log(data.data);
            this.process_data(data.data)
          
        });   
    }


    _onRefresh=()=>{
        this.setState({isRefreshing:true})
        this.setState({suppliers_data:[]})
        this.setState({limit:0})
        this.get_data(0); 
        this.setState({isRefreshing:false})
        this.setState({ loadmore_test:' ',}) ;
    }

        ///// LOAD MORE ////////////////////
        handleLoadMore = () => {
        
            this.setState({ loadmore_test:'Loading...',}) ;
            var limit = parseInt(this.state.limit) + parseInt(20);  // increase page by 1
            this.setState({limit:limit});
            this.get_data(limit);  // method for API call 
            this.setState({ loadmore_test:'Scroll down to load more',}) ;
         
        };


    edit_it = (id,name='') => { 
                this.props.navigation.navigate('Explore_data', {
                    supp_id: id,
                    supp_name: name
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
                    data={this.state.suppliers_data}
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
                                    this.edit_it(item.supplier_id,item.supplier_name);
                                }}>
                                  <Supplier_compo event_name={item.event_name} supplier_name = {item.supplier_name} /> 
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
    heading:{
        fontSize:22,
        color:"#000000",
        marginTop: 10, 
        width:100,
        marginBottom: 20,
        fontWeight:"bold"
    }
});
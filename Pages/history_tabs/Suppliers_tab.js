import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList,RefreshControl,ActivityIndicator } from 'react-native';

import { SQLite } from 'expo-sqlite'; 
const db = SQLite.openDatabase('db.db'); 
import Supplier_compo from '../History_components/Supplier_compo'; 


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
            suppliers_data:[...this.state.suppliers_data,...rows._array],
            loadingmore:false
        })
    }

    get_data = (limit) => {
      
        db.transaction(
            tx => {
                tx.executeSql('SELECT * from suppliers '
                +' LEFT JOIN events on events.event_id = suppliers.event_id '   
                +' ORDER BY suppliers.supplier_note_id DESC  LIMIT '+limit+',20', [], (_, {rows}) => 
                this.process_data(rows)
                 
                ); 

            },
        );
 

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
                                {/* {console.log(item.supplier_name)} */}
                                  <Supplier_compo event_name={item.event_name} supplier_name = {item.supplier_name} /> 
                         
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
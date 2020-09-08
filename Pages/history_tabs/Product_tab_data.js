import React, { Component } from 'react';
import { View, Modal, Text, StyleSheet, Image, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';

import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
import Product_compo from '../History_components/Product_compo'; 
import Edit_product from '../edit_note/Edit_product';
import { tabs_data_load } from '../models/all_models';
 
export default class Products_tab_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products_data: [],
            loadmore_test: '',
            isRefreshing: false,
            loadingmore: false,
            history_array: [],
            limit: 0,
            edit: false,
            edit_id: 0
        };
    }

    componentDidMount() {
        // this.get_data(this.state.limit);

        this.props.navigation.addListener('willFocus', (route) => {
            this._onRefresh();
        });

    }

    process_data = (rows) => {

        this.setState({
            products_data: [...this.state.products_data, ...rows],
            loadingmore: false
        });

        console.log(this.state.products_data);
        
    }

    get_data = (limit,tabname='products') => {
      
        tabs_data_load(limit,tabname).then((response) => {  
            var data   = JSON.parse(response);
            console.log(data.data);
            this.process_data(data.data)
          
        });   
    }

    _onRefresh = () => {
        this.setState({ isRefreshing: true })
        this.setState({ products_data: [] })
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

    //////////////EDIT PRODUCT OR CONTACT
    edit_it = (id, type) => {   
            this.props.navigation.navigate('Edit_product', {
                product_id: id
            });   
    }

    render() {
        return (
            <View style={styles.container}>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.edit}
                    onRequestClose={() => {
                        this.edit_data(false)
                    }}>
                    <TouchableOpacity style={{ zIndex: 10, position: "absolute", right: 10, top: 10 }} onPress={() => { this.edit_data(false) }}>
                        <Image
                            source={require('../../assets/img/close.png')}
                            style={{ width: 40, height: 40, marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                    <Edit_product product_id={this.state.edit_id} />
                </Modal>

                {this.state.loadingmore &&
                    <ActivityIndicator animating={this.state.loadingmore} size="large" color="red" />
                }
                <FlatList
                    numColumns={1}
                    data={this.state.products_data}
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

                            <TouchableOpacity onPress={() => { this.edit_it(item.product_id) }}>
                                <Product_compo note={item.note} moq={item.moq} fob_price={item.fob_price} product_name={item.product_name} supplier_name={item.supplier_name} image={item.main_image.src} />
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
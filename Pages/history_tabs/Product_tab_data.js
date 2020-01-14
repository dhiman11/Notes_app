import React, { Component } from 'react';
import { View, Modal, Text, StyleSheet, Image, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';

import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
import Product_compo from '../History_components/Product_compo'; 
import Edit_product from '../edit_note/Edit_product';

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
            products_data: [...this.state.products_data, ...rows._array],
            loadingmore: false
        })
    }

    get_data = (limit) => {

        db.transaction(
            tx => {
                tx.executeSql('SELECT * from products '
                    + ' LEFT JOIN suppliers on suppliers.supplier_note_id = products.supplier_note_id '
                    + ' LEFT JOIN photos ON photos.connect_id = products.product_id'
                    + ' WHERE photos.connect_table ="products" '
                    + ' GROUP BY products.product_id '
                    + ' ORDER BY products.product_id DESC  LIMIT ' + limit + ',20', [], (_, { rows }) =>

                        this.process_data(rows)


                );

            },
        );


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
                                <Product_compo note={item.note} moq={item.moq} fob_price={item.fob_price} product_name={item.product_name} supplier_name={item.supplier_name} image={item.file_name} />
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
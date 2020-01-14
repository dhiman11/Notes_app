//import liraries
import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet, FlatList, ScrollView } from 'react-native';
import Product_list_offline from '../Products/Product_list_offline';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Product_detail_modal from '../modals/Product_detail_modal';

import { SQLite } from 'expo-sqlite';
import Edit_product from '../edit_note/Edit_product';
const db = SQLite.openDatabase('db.db');
// create a component
class Product_offline_data extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            products_data: [],
            loadmore: 0,
            loadmore_btn_text: 'Load More',
            search_input: '',
            min_usd: 0,
            max_usd: null,
            prudut_detail_popup: false,
            prudut_detail_data: [],
            prudut_main_photo: [],
            product_all_images: []
        }
        this.loadProducts(this.state.loadmore, '', this.state.min_usd, this.state.max_usd, '', '', this.state.search_input, 'all', 'this_admin', 'all');
    }


    /////////////////////////////////////////////////////
    ////////////// Reload Data when Change Tab //////////

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                // this.setState({ isLoading: true });
                // this.setState({ products_data: [] });
                // this.setState({ loadmore: 0 });
                // this.loadProducts(this.state.loadmore, '', this.state.min_usd, this.state.max_usd, '', '', this.state.search_input, 'all', 'this_admin', 'all');

            },
        );
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }

    /////////////////////////////////////////////////////
    ////////////// Reload Data when Change Tab //////////


    process_data = (data) => {

        this.setState({
            products_data: [...this.state.products_data, ...data._array],
            loadmore_btn_text: "Load",
            isLoading: false
        }) //another array
    }

    /////////Load Product Request/////////
    ///////////////////////////////////
    loadProducts = (limit, categories, min_usd, max_usd, min_date, max_date, search_input, search_type, event_name, search_by_user) => {


        if (max_usd) {
            var where_max_price = " AND products.fob_price <= " + max_usd;
        } else {
            var where_max_price = ' ';
        }

        if (min_usd) {
            var where_min_price = " AND products.fob_price >= " + min_usd;
        } else {
            var where_min_price = ' ';
        }




        if (search_input.length > 1) {
            var where_string = " AND products.product_name LIKE '%" + search_input + "%'";
        } else {
            var where_string = ' ';
        }

        var final_where = where_min_price + where_max_price + where_string

        var query = 'SELECT * from products '
            + ' LEFT JOIN photos ON photos.connect_id = products.product_id'
            + ' WHERE photos.connect_table ="products" '
            + final_where
            + ' GROUP BY products.product_id '
            + ' ORDER BY products.product_id DESC  LIMIT ' + limit + ',20';

        console.log(query);

        db.transaction(
            tx => {
                tx.executeSql(query, [], (_, { rows }) =>
                    this.process_data(rows)
                );

            },
        );


    }

    ////////////Footer Load more///////////////
    /////////////////////////////////////////
    renderFooter = (btn_text) => {
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <View>
                    <TouchableOpacity onPress={() => { this.loadmore_products() }} style={styles.loadmore}>
                        <Text style={{ color: "#fff" }}>{btn_text}</Text>
                    </TouchableOpacity>
                </View>

            </View>





        );
    };

    //////////Load More detail////////////
    ///////////////////////////////////

    loadmore_products = () => {
        var loadmore_val = parseInt(this.state.loadmore) + parseInt(10);
        this.setState({
            loadmore: loadmore_val,
            loadmore_btn_text: "Loading..."
        });


        this.loadProducts(loadmore_val, '', this.state.min_usd, this.state.max_usd, '', '', this.state.search_input, 'all', 'this_admin', 'all');

    }

    search_products = () => {
        /////////////RESET PRODUCT SCREEN///////////
        var resetload_more = 0;

        this.setState({
            loadmore: resetload_more,
            products_data: [],
            isLoading: true,
        })

        console.log(this.state.max_usd);

        ///////////////////////////////
        //////++++++++++++++++++++++++
        ///// LOAD NEW DATA ++++++++++

        this.loadProducts(resetload_more, '', this.state.min_usd, this.state.max_usd, '', '', this.state.search_input, 'all', 'this_admin', 'all');

        /////////////////////////////

    }

    //////////////EDIT PRODUCT OR CONTACT
    edit_it = (id, type) => {
        this.props.navigation.navigate('Edit_product', {
            product_id: id
        });
    }

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    render() {
        return (
            <View>

                {this.state.prudut_detail_popup ? <Product_detail_modal all_images={this.state.product_all_images} product_main_pic={this.state.prudut_main_photo} product_data={this.state.prudut_detail_data} modalvisibility={this.state.prudut_detail_popup} updateState={this.show_hide_detail_modal.bind(this)} /> : null}

                <View style={{ flexDirection: "row" }}>
                    <TextInput
                        onChangeText={(text) => this.setState({ search_input: text })}
                        onSubmitEditing={() => this.search_products()}
                        style={{ borderColor: "red", borderWidth: 1, marginLeft: 10, marginTop: 10, width: 300 }}
                        placeholder="Search here"
                    />
                    <TouchableOpacity onPress={() => {

                        this.search_products();

                    }} style={{ backgroundColor: "red", paddingLeft: 23, paddingBottom: 13, paddingTop: 13, paddingRight: 23, marginTop: 10 }}>
                        <Image
                            style={{ width: 25, height: 25 }}
                            source={require('../../assets/img/search.png')}
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ min_usd: text })}
                            style={{ borderColor: "red", borderWidth: 1, marginTop: 5, marginLeft: 10, width: 100, height: 40 }}
                            placeholder="min price"
                        />
                        <TextInput
                            onChangeText={(text) => this.setState({ max_usd: text })}
                            style={{ borderColor: "red", borderWidth: 1, marginTop: 5, marginLeft: 10, width: 100, height: 40 }}
                            placeholder="max price"
                        />
                    </View>
                </View>

                <View style={{ marginLeft: 10 }}>
                    <Text>Looking for: {this.state.search_input} .</Text>
                </View>

                {this.state.isLoading &&
                    <ActivityIndicator animating={this.state.isLoading} size="large" color="red" />
                }
                <FlatList
                    style={styles.container}
                    numColumns={2}
                    data={this.state.products_data}
                    //Item Separator View
                    renderItem={({ item }) => (

                        <TouchableOpacity onPress={() => { this.edit_it(item.product_id) }}>
                            <Product_list_offline note={item.note} moq={item.moq} fob_price={item.fob_price} product_name={item.product_name} image={item.file_name} />
                        </TouchableOpacity>
                    )}

                    ListFooterComponent={this.renderFooter(this.state.loadmore_btn_text)}
                    keyExtractor={(item, index) => index.toString()}

                />






            </View>




        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginBottom: 60,
    },
    rowcolumn: {
        flexDirection: "row",
        flex: 1,
    },
    loadmore: {
        width: 100,
        backgroundColor: "red",
        marginBottom: 200,
        color: "#fff",
        marginLeft: 10,
        padding: 10
    }

});

//make this component available to the app
export default Product_offline_data;

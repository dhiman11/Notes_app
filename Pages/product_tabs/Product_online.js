//import liraries
import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet, FlatList, NetInfo,Dimensions  } from 'react-native';
import Product_list from '../Products/Product_list';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Product_detail_modal from '../modals/Product_detail_modal';
import { api_name } from '../Settings';
 
const {width} = Dimensions.get('window');
const itemWidth = (width) / 180;

// create a component
class Product_online extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isOnline: true,
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
        this.loadProducts(this.state.loadmore, '', this.state.min_usd, this.state.max_price, '', '', this.state.search_input, 'all', 'this_admin', 'all');
    }


    /////////////////////////////////////////////////////
    ////////////// Reload Data when Change Tab //////////

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.setState({ isLoading: true });
                this.setState({ products_data: [] });
                this.setState({ loadmore: 0 });
                this.loadProducts(this.state.loadmore, '', this.state.min_usd, this.state.max_price, '', '', this.state.search_input, 'all', 'this_admin', 'all');

                NetInfo.isConnected.fetch().then(res => {
                    this.setState({
                        isOnline: res
                    });
                })
            },
        );

    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }

    /////////////////////////////////////////////////////
    ////////////// Reload Data when Change Tab //////////




    /////////Load Product Request/////////
    ///////////////////////////////////
    loadProducts = (limit, categories, min_usd, max_usd, min_date, max_date, search_input, search_type, event_name, search_by_user) => {

        fetch(api_name+'products/ProductsList/all_products', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                limit: limit,
                categories: categories,
                min_usd: min_usd,
                max_usd: max_usd,
                min_date: min_date,
                max_date: max_date,
                search_input: search_input,
                search_type: search_type,
                event_name: event_name,
                search_by_user: search_by_user
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    products_data: [...this.state.products_data, ...responseJson],
                    loadmore_btn_text: "Load",
                    isLoading: false
                }) //another array

            })
            .catch((error) => {
                // console.error(error);
            });
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


        this.loadProducts(loadmore_val, '', this.state.min_usd, this.state.max_price, '', '', this.state.search_input, 'all', 'this_admin', 'all');

    }

    search_products = () => {
        /////////////RESET PRODUCT SCREEN///////////
        var resetload_more = 0;

        this.setState({
            loadmore: resetload_more,
            products_data: [],
            isLoading: true,
        })


        ///////////////////////////////
        //////++++++++++++++++++++++++
        ///// LOAD NEW DATA ++++++++++

        this.loadProducts(resetload_more, '', this.state.min_usd, this.state.max_price, '', '', this.state.search_input, 'all', 'this_admin', 'all');

        /////////////////////////////

    }


    //////////// Show product Edit ///////////////////
    //////////////////////////////////////////////////
    show_product = (product_id) => {

        this.setState({
            prudut_detail_data: [],
            prudut_main_photo: [],
            product_all_images: [],
            prudut_detail_popup: true
        })

        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//// 
        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++////

        fetch(api_name+'edit/edit/product/' + product_id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: product_id,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.result) {

                    this.setState({
                        prudut_detail_data: responseJson.product,
                        prudut_main_photo: responseJson.product.main_image,
                        product_all_images: responseJson.product.all_images,
                    })
                }

            })
            .catch((error) => {
                console.error(error);
            });

        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++////
        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++////

    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////


    //////////// Show Hide popup ///////////////////
    //////////////////////////////////////////////////
    show_hide_detail_modal = (visible) => {

        this.setState({
            prudut_detail_popup: visible
        });



    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    render() {
        return (
            <View>
            {this.state.isOnline ? 
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
                            numColumns={parseInt(itemWidth)}
                            data={this.state.products_data}
                            //Item Separator View
                            renderItem={({ item }) => (


                                <Product_list updateState={this.show_product.bind(this)} style={styles.rowcolumn} data={item} />

                            )}

                            ListFooterComponent={this.renderFooter(this.state.loadmore_btn_text)}
                            keyExtractor={(item, index) => index.toString()}

                        />






                    </View>:
                    <View>
                        <Text>You are offline</Text>
                        </View>
                    }

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
export default Product_online;

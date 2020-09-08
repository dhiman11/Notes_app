//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
 
 
// import Edit_product from './edit_note/Edit_product.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Event_compo from './History_components/Event_compo.js';
import Contact_compo from './History_components/Contact_compo.js';
import Product_compo from './History_components/Product_compo.js';
import Supplier_compo from './History_components/Supplier_compo.js';
import { api_name } from './Settings.js';

// create a component
class History_online extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadmore_test: '',
            isRefreshing: false,
            loadingmore: true,
            history_array: [],
            limit: 0,

        }
        this.__load_historydata(this.state.limit);

    }


    /////////////////////////////////////////////////////
    ////////////// Reload Data when Change Tab //////////

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.setState({ loadingmore: true });
                this.setState({ history_array: [] });
                this.setState({ limit: 0 });
                this.__load_historydata(0);

            },
        );
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }

    /////////////////////////////////////////////////////
    ////////////// Reload Data when Change Tab //////////



    ////// ON REFERESH PAGE /////////
    _onRefresh = () => {
        this.setState({ isRefreshing: true })
        this.setState({ history_array: [] })
        this.setState({ limit: 0 })
        this.__load_historydata(0);
        this.setState({ isRefreshing: false })
        this.setState({ loadmore_test: ' ', });
    }


    ///// LOAD MORE ////////////////////
    handleLoadMore = () => {

        this.setState({ loadmore_test: 'Loading...', });
        var limit = parseInt(this.state.limit) + parseInt(20);  // increase page by 1
        this.setState({ limit: limit });
        this.__load_historydata(limit);  // method for API call 
        this.setState({ loadmore_test: 'Scroll down to load more', });

    };


    ////////////////////////////// LOAD MORE DATA ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////// 
    __load_historydata = (limit) => {
        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//// 
        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++////

        fetch(api_name + 'history/History_page/history_data', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                limit: limit,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    history_array: [...this.state.history_array, ...responseJson],
                    loadingmore: false
                });

            })
            .catch((error) => {
                console.error(error);
            });

        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++////
        ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++////
        // console.log(this.state.history_array);

    }

    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    edit_it = (id, type,name='') => {
       
        if (type == "event") {
            this.props.navigation.navigate('Add_suppliers', {
                event_id: id,
                event_name: name
            });
        }

        if (type == "supplier") {
            this.props.navigation.navigate('Explore_data', {
                supp_id: id,
                supp_name: name
            });
        }


        if (type == "product") {
            this.props.navigation.navigate('Edit_p', {
                product_id: id
            });
        }
        if (type == "contact") {
            this.props.navigation.navigate('Edit_c', {
                contact_id: id
            });
        }

    }




    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.heading}>HISTORY</Text>
                </View>
                {this.state.loadingmore &&
                    <ActivityIndicator animating={this.state.loadingmore} size="large" color="red" />
                }
                <FlatList
                    numColumns={1}
                    data={this.state.history_array}
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

                            {item.data_type == 'event' &&
                                <TouchableOpacity onPress={() => {
                                    this.edit_it(item.event.event_id,'event',item.event.event_name);
                                }}>
                                     <Event_compo image={item.event_images} event_name={item.event.event_name} city={item.event.city} from_date={item.event.from_date} to_date={item.event.to_date} data={item.event} />
                                </TouchableOpacity>
                            }


                            {item.data_type == 'supplier' &&
                                <TouchableOpacity onPress={() => {
                                        this.edit_it(item.data.supplier_note_id, 'supplier',item.data.supplier_name);
                                    }}>
                                <Supplier_compo image={item.supplier_images} supplier_name={item.data.supplier_name} />
                                </TouchableOpacity>
                            }

                            {item.data_type == 'contact' &&
                                <TouchableOpacity onPress={() => {
                                    this.edit_it(item.data.contact_id, 'contact');
                                }}>
                                    <Contact_compo contact_name={item.data.contact_name} supplier_name={item.data.supplier_name} phone={item.data.phone} email={item.data.email} note={item.data.note} data={item.data} image={item.contact_images} />
                                </TouchableOpacity>
                            }

                            {item.data_type == 'product' &&
                                <TouchableOpacity onPress={() => {
                                    this.edit_it(item.data.product_id, 'product');
                                }}>
                                    <Product_compo product_name={item.data.product_name} supplier_name={item.data.supplier_name} fob_price={item.data.fob_price} moq={item.data.moq} Note={item.data.Note} image={item.pro_images} data={item.data} />
                                </TouchableOpacity>
                            }

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

//make this component available to the app
export default History_online; 

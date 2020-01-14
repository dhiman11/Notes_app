import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, RefreshControl, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');



import Contact_compo_e from "../../Explorer_components/Contact_compo_e";
import Product_compo_e from "../../Explorer_components/Product_compo_e";
import Create_product from '../notes_components/Create_product';
import Create_contacts from '../notes_components/Create_contacts';

import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { load_products } from '../../models/all_models';
 

export default class Pro_con_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products_data: [],
            contacts_data: [],
            supplier_id: '',
            suppliername: '',
            limit:0,
            p_limit: 0,
            c_limit: 0,
            contact_model: false,
            product_model: false
        };
    }



    componentDidMount() {
        let params = this.props.navigation.state.params;
        let supplier_id = params['supp_id'];
        let suppliername = params['supp_name'];

        this.get_product_data(this.state.p_limit, supplier_id);
        this.get_contact_data(this.state.p_limit, supplier_id);

        this.setState({
            supplier_id: supplier_id,
            suppliername: suppliername,
        })

    }

    go_supp_page = () => {
        this.props.navigation.navigate('Add_supp');
    }



    process_data = (rows, type) => {
 

        if (type == 'products') {
            this.setState({
                products_data: [...this.state.products_data, ...rows],
                loadingmore: false
            })
        }
        if (type == 'contacts') {
            this.setState({
                contacts_data: [...this.state.contacts_data, ...rows],
                loadingmore: false
            })
        }

        console.log(this.state.products_data)
     
    }


    get_product_data = (limit, supp_id) => {

        load_products(supp_id,limit).then((response) => { 
            var data   = JSON.parse(response);  
            this.process_data(data, 'products')
        });

      
        // db.transaction(
        //     tx => {
        //         tx.executeSql('SELECT * from products '
        //             + ' LEFT JOIN suppliers on suppliers.supplier_note_id = products.supplier_note_id '
        //             + ' LEFT JOIN photos ON photos.connect_id = products.product_id'
        //             + ' WHERE photos.connect_table ="products" AND  products.supplier_note_id = ? '
        //             + ' GROUP BY products.product_id '
        //             + ' ORDER BY products.product_id DESC  LIMIT ' + limit + ',20', [supp_id], (_, { rows }) =>
        //                 this.process_data(rows, 'products')
        //         );

        //     },
        // );
    }



    get_contact_data = (limit, supp_id) => {
        // db.transaction(
        //     tx => {
        //         tx.executeSql('SELECT * from contacts '
        //             + ' LEFT JOIN suppliers on suppliers.supplier_note_id = contacts.supplier_note_id '
        //             + ' LEFT JOIN photos ON photos.connect_id = contacts.contact_id'
        //             + ' WHERE photos.connect_table ="contacts"  AND  contacts.supplier_note_id = ? '
        //             + ' GROUP BY contacts.contact_id '
        //             + ' ORDER BY contacts.contact_id DESC  LIMIT ' + limit + ',20', [supp_id], (_, { rows }) =>
        //                 this.process_data(rows, 'contacts')
        //         );

        //     },
        // );
    }



    ///// refresh_data ////////////////////
    ////////////////////////////////////////  
    _onRefreshp = () => {
        this.setState({ isRefreshing: true })
        this.setState({ products_data: [] })
        this.setState({ limit: 0 })
        this.get_product_data(0, this.state.supplier_id);
        this.setState({ isRefreshing: false })
        this.setState({ loadmore_test: ' ', });
    }
    _onRefreshc = () => {
        this.setState({ isRefreshing: true })
        this.setState({ contacts_data: [] })
        this.setState({ limit: 0 })
        this.get_contact_data(0, this.state.supplier_id);
        this.setState({ isRefreshing: false })
        this.setState({ loadmore_test: ' ', });
    }

    ///// LOAD MORE ////////////////////
    ////////////////////////////////////////
    handleLoadMorep = () => {

        this.setState({ loadmore_test: 'Loading...', });
        var limit = parseInt(this.state.limit) + parseInt(20);  // increase page by 1
        this.setState({ limit: limit });
        this.get_product_data(limit, this.state.supplier_id);  // method for API call 
        this.setState({ loadmore_test: 'Scroll down to load more', });
    };
    handleLoadMorec = () => {

        this.setState({ loadmore_test: 'Loading...', });
        var limit = parseInt(this.state.limit) + parseInt(20);  // increase page by 1
        this.setState({ limit: limit });
        this.get_contact_data(limit, this.state.supplier_id);  // method for API call 
        this.setState({ loadmore_test: 'Scroll down to load more', });

    };
    ////////////////////////////////////////    
    ////////////////////////////////////////    



    setModalVisible = async (state, type) => {
        ////////Contacts Model
        if (type == 'contacts') {
            this.setState({
                contact_model: state
            })
            await this._onRefreshc();
        }
        /////////Products model
        if (type == 'products') {
            this.setState({
                product_model: state
            })

            await this._onRefreshp();
        } 

    }

    //////////////EDIT PRODUCT OR CONTACT
    edit_it=(id,type)=>{
        if(type == "product"){
            this.props.navigation.navigate('Edit_product', {
                product_id: id 
            });
        }
        if(type=="contact"){
            this.props.navigation.navigate('Edit_contact', {
                contact_id: id 
            });
        }
       
    }


    render() {
        return (
            <View style={styles.container} >
                {this.state.contact_model ?
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.contact_model}
                        onRequestClose={() => {
                            this.setModalVisible(false, 'contacts')
                        }}>
                        <TouchableOpacity style={{ zIndex: 10, position: "absolute", right: 10, top: 10 }} onPress={() => { this.setModalVisible(false, 'contacts') }}>
                            <Image
                                source={require("./../../../assets/img/close.png")}
                                style={{ width: 40, height: 40, marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                        <Create_contacts single_supp={true} supp_id={this.state.supplier_id} suppliername={this.state.suppliername} />
                    </Modal> : null}


                {this.state.product_model ?
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.product_model}
                        onRequestClose={() => {
                            this.setModalVisible(false, 'products')
                        }}>
                        <TouchableOpacity style={{ zIndex: 10, position: "absolute", right: 10, top: 10 }} onPress={() => { this.setModalVisible(false, 'products') }}>
                            <Image
                                source={require('./../../../assets/img/close.png')}
                                style={{ width: 40, height: 40, marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                        <Create_product single_supp={true} supp_id={this.state.supplier_id} suppliername={this.state.suppliername} />
                    </Modal> : null}


                <View style={styles.inline_block}>
                    <TouchableOpacity onPress={() => { this.go_supp_page() }} >
                        <Ionicons name="md-arrow-round-back" size={60} style={{ color: 'black', marginRight: 10, }} />
                    </TouchableOpacity>
                    <Text style={styles.heading}>{this.state.suppliername}</Text>
                </View>


                <View style={{ marginTop: 10 }}>
                    <View style={{ width: "100%", backgroundColor: "#ed7d3182", padding: 5 }} >

                        <View style={styles.inline_block}>
                            <TouchableOpacity onPress={() => { this.setModalVisible(true, 'contacts') }}  >
                                <MaterialIcons name="add-circle-outline" size={35} color="#000000" />
                            </TouchableOpacity>
                            <Text style={styles.add_name}> CONTACTS</Text>
                        </View>

                        <View style={{ marginTop: 5, }}>
                            <FlatList
                                style={{ height: 212 }}
                                //    numColumns={3}
                                horizontal={true}
                                data={this.state.contacts_data}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefreshc.bind(this)}
                                    />
                                }
                                keyExtractor={(item, index) => index.toString()}
                                onEndReachedThreshold={3}
                                onEndReached={this.handleLoadMorec.bind(this)}
                                renderItem={({ item, index }) => (

                                   
                                    <TouchableOpacity onPress ={()=>{ this.edit_it(item.contact_id,"contact") }}>
                                            <Contact_compo_e note={item.note} phone={item.phone} email={item.email} supplier_name={item.supplier_name} contact_name={item.contact_name} image={item.file_name} />
                                        </TouchableOpacity>
                                    

                                )}
                            />
                        </View>

                    </View>


                    <View style={{ width: "100%", backgroundColor: "#8cc63e6b", padding: 5 }}>

                        <View style={styles.inline_block}>
                            <TouchableOpacity onPress={() => { this.setModalVisible(true, 'products') }}  >
                                <MaterialIcons name="add-circle-outline" size={35} color="#000000" />
                            </TouchableOpacity>
                            <Text style={styles.add_name}> PRODUCTS</Text>

                        </View>

                        <View style={{ marginTop: 5, marginBottom: 120, }}>
                            <FlatList
                                // numColumns={2}
                                style={{ height: 195 }}
                                horizontal={true}
                                data={this.state.products_data}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefreshp.bind(this)}
                                    />
                                }
                                keyExtractor={(item, index) => index.toString()}
                                onEndReachedThreshold={3}
                                onEndReached={this.handleLoadMorep.bind(this)}
                                renderItem={({ item, index }) => (

                                  
                                    <TouchableOpacity onPress ={()=>{ this.edit_it(item.product_id,"product") }}>
                                            <Product_compo_e product_id = {item.product_id} note={item.note} moq={item.moq} fob_price={item.fob_price} product_name={item.product_name} supplier_name={item.supplier_name} image={item.file_name} />
                                        </TouchableOpacity>
                                   

                                )}
                            />

                        </View>
                    </View>


                </View>
            </View>
        );
    }
}


const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            margin: 20,

        },
        heading: {
            fontSize: 22,
            color: "#000000",
            marginTop: 10,
            marginBottom: 10,
            fontWeight: "bold",
            width: "70%"
        },
        inline_block: {
            flexDirection: 'row',
            alignSelf: 'flex-start'
        },
        add_name: {
            marginTop: 8,
            width: 200,
            marginLeft: 10,
            fontWeight: "bold",
            textAlignVertical: 'top'
        }
    });
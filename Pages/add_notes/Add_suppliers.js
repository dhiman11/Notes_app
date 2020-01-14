import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';

////////////////////SQLLITE CONNECTION 
import My_suppliers from './events_components/My_suppliers';
import Create_supplier from './notes_components/Create_supplier';
////////////////////SQLLITE CONNECTION
 
const db = SQLite.openDatabase('db.db');
import { SQLite } from 'expo-sqlite';
//////////////////////////////////////
//////////////////////////////////////
import { MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { load_suppliers } from '../models/all_models';

export default class Add_suppliers extends Component {


    constructor(props) {
        super(props);
        this.state = {
            Last_events_list: [],
            event_id: '',
            event_name: '',
            add_supp_model: false
        };
    }

    componentDidMount() {
        let params = this.props.navigation.state.params;
        let event_id = params['event_id'];
        let event_name = params['event_name'];
        this.get_suppliers_data(event_id);

        this.setState({
            event_id: event_id,
            event_name: event_name
        })




        //////// Create the suppliers database if not existed///////////
    



    }


    /////////////////////////////
    // GET ALL THE SUPPLIERS DATA from event id
    ////////////////////////////

    get_suppliers_data = (event_id) => {

        load_suppliers(event_id).then((response) => { 
            var supp_data   = JSON.parse(response);
            this.setState({
                      all_suppliers:supp_data
                  })  
        });
 


    }


    /////////////////////////////
    ///GO TO EVENT page 
    go_event_page = () => {
        this.props.navigation.navigate('Add_events');
    }


    load_suppliers_data = async (supp_data) => {

        this.props.navigation.navigate('Explore_data', {
            supp_id: supp_data.supplier_id,
            supp_name: supp_data.suppliername
        });
    }


    setModalVisible = (state) => {
        this.setState({
            add_supp_model: state
        })
        this.get_suppliers_data(this.state.event_id);
    }


    render() {
        return (
            <View style={styles.container} >

                {this.state.add_supp_model ?
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.add_supp_model}
                        onRequestClose={() => {
                            this.setModalVisible(false)
                        }}>
                        <TouchableOpacity style={{ zIndex: 10, position: "absolute", right: 10, top: 10 }} onPress={() => { this.setModalVisible(false) }}>
                            <Image
                                source={require('../../assets/img/close.png')}
                                style={{ width: 40, height: 40, marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                        <Create_supplier single_event={true} event_id={this.state.event_id} event_name={this.state.event_name} />
                    </Modal> : null}


                <View style={styles.inline_block}>


                    <TouchableOpacity style={{marginRight:30}} onPress={() => { this.go_event_page() }} >
                        <Ionicons name="md-arrow-round-back" size={60} color="#000000" />
                        <Text style={styles.eventname}>EVENTS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setModalVisible(true)
                    }}  >
                        <MaterialIcons name="add-circle-outline" size={60} color="#000000" />
                        <Text style={styles.eventname}>ADD SUPPLIER</Text>
                    </TouchableOpacity>


                </View>

                <Text style={styles.heading}>{this.state.event_name} : Suppliers</Text>

                <FlatList
                    numColumns={4}
                    data={this.state.all_suppliers}
                    //Item Separator View
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (

                        <My_suppliers load_supplier_page={this.load_suppliers_data.bind(this)} supplier_id={item.supplier_note_id} suppliername={item.supplier_name} />

                    )}

                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,

    },
    heading: {
        fontSize: 22,
        color: "#000000",
        marginTop: 10,
        marginBottom: 10,
        fontWeight: "bold"
    },
    inline_block: {
        flexDirection: 'row',
        alignSelf: 'flex-start'
    }
});

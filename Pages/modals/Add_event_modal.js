//import liraries

import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import DateTimePicker from "react-native-modal-datetime-picker";
 
import { SQLite } from 'expo-sqlite';
import { api_name } from '../Settings';

// create a component


const db = SQLite.openDatabase('db.db');

class Add_event_modal extends Component {

    state = {
        isDateTimePickerVisible: false,
        all_events: [],
        fairnew: '',
        city: '',
        fromdate: '-',
        todate: '-',
        user_id: 1
    }


    /////////////////Check if this table exist or not 


    setModalVisible(visible) {
        this.props.updateState(visible);
    }

    /////////////////////
    //// DATES ////////

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };




    confirmed = date => {

        var date = new Date(date);
        var date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

        if (this.state.selecting_date_for == "fromto") {

            this.setState({
                fromdate: date.toString()
            });
        }
        if (this.state.selecting_date_for == "todate") {
            this.setState({
                todate: date.toString()
            });
        }
        this.hideDateTimePicker();
    };


    showDateTimePicker = (datetype) => {
        this.setState({
            isDateTimePickerVisible: true,
            selecting_date_for: datetype
        });
    };

    async set_data(newdata) {

        try {
            AsyncStorage.getItem('m_data', (err, result) => {

                if (result !== null) {

                } else {

                }
            });


        } catch (e) {

        }
    }


    ////////////////////
    /////SUBMIT THE FORM
    ///////////////////

    submitForm = () => {
        //////////////////////////
        ///////////////////////// 

        let fairnew = this.state.fairnew;
        let city = this.state.city;
        let fromdate = this.state.fromdate;
        let todate = this.state.todate;
        let user_id = this.state.user_id;

        var newdata = JSON.stringify({
            fairnew: fairnew,
            city: city,
            fromdate: fromdate,
            todate: todate,
            user_id: user_id,
        });

        // this.set_data(newdata);
 
        fetch(api_name+'/Events/addevent', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                fairnew:fairnew,
                city:city,
                fromdate:fromdate,
                todate:todate,
                user_id:user_id,
            }),
            }).then((response) => response.json())
            .then((data) => { 
                   this.setModalVisible(false)  
            })
            .catch((error) => {
             // console.error(error);
            });
 

        this.setModalVisible(false);
 
    }

    /////////////////////
    //// DATES ////////

    render() {
        return (
            <View>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.modalvisibility}
                    onRequestClose={() => {
                        this.setModalVisible(false)
                    }}>

                    <TouchableOpacity style={{ zIndex: 10, position: "absolute", right: 10, top: 10 }} onPress={() => { this.setModalVisible(false) }}>
                        <Image
                            source={require('../../assets/img/close.png')}
                            style={{ width: 40, height: 40, marginLeft: 8 }}
                        />
                    </TouchableOpacity>

                    <View style={styles.container}>
                        <Text style={{ fontSize: 22, marginBottom: 10, fontWeight: "bold", color: "#000000" }}>CREATE EVENT</Text>

                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ fairnew: text })}
                                placeholderTextColor='#818181'
                                placeholder="Name of new event"
                            />
                        </View>

                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ city: text })}
                                placeholderTextColor='#818181'
                                placeholder="(City of New Event)"
                            />
                        </View>
              
                        <View>
                            <TouchableOpacity
                                onPress={() => { this.showDateTimePicker('fromto') }}
                                style={styles.inputfields}
                            >
                                <Text style={{ fontSize: 22,color:"#818181" }}>From date : {this.state.fromdate}</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity
                                onPress={() => { this.showDateTimePicker('todate') }}
                                style={styles.inputfields}
                            >

                                <Text style={{ fontSize: 22,color:"#818181" }} >To date {this.state.todate}</Text>

                            </TouchableOpacity>
                        </View>
                        <View>

                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.confirmed}
                                onCancel={this.hideDateTimePicker}
                            />
                        </View>
                        <View style={{ alignItems: "center", alignContent: "center",marginTop: 15, }}>
                            <TouchableOpacity
                                onPress={() => { this.submitForm() }}
                                style={{ backgroundColor: "#176fc1", width: 100, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                                <Text style={{ color: "#fff" }}>CREATE</Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        backgroundColor: '#fff',
    },
    datebutton: {
        alignSelf: 'stretch',
        opacity: 0.4,
        marginBottom: 15,
        fontSize: 22,
        backgroundColor: "#fff",
        maxHeight: 50,
        minWidth: 300,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 15,
        paddingTop: 8,
        paddingBottom: 15


    },
    inputfields: {
        alignSelf: 'stretch',
        opacity: 0.4,
        marginTop: 15,
        fontSize: 22,
        backgroundColor: "#fff",
        maxHeight: 60,
        minWidth: "100%",
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 15
    },
});

//make this component available to the app
export default Add_event_modal;

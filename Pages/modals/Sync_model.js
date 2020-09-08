import React, { Component } from 'react';
import {
    View, Text, Modal, ScrollView, StyleSheet, TouchableOpacity
} from 'react-native';


////////////////////SQLLITE CONNECTION
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
//////////////////////////////////////

export default class Sync_model extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            supplier_array: []
        };
    }

    setModalVisible(visible) {
        this.props.sync_popup(visible);
    }

    create_sync_array = () => {

        db.transaction((tx) => {
            tx.executeSql('SELECT * from events', [], (tx, results) => {

                this.create_sub_array(results.rows._array);

            });


        });
    }


    create_sub_array = async (data) => {

        var event_data = [];
        for (var i = 0; i < data.length; i++) {

            var suppliers_data = await this.get_supplier_array(data[i]['event_id']);
            data[i]['suppliers'] = suppliers_data.supps;
            event_data.push(data[i])
        }

        console.log(event_data);
    }

    get_supplier_array = async (event_id) => {
        let supps = [];
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql('SELECT * from suppliers where event_id = ?', [event_id], (_, { rows }) => {
                        supps.push(rows._array);
                        resolve({ supps });
                    });
                }, null, null);
        });

    }


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


                    <View>
                        <TouchableOpacity style={styles.startbutton} onPress={() => { this.create_sync_array() }} >
                            <Text style={{ color: "#fff", fontSize: 40 }}>
                                Start
                            </Text>
                        </TouchableOpacity>

                        <Text>
                            {console.log(this.state.data)}
                        </Text>
                    </View>

                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    startbutton: {
        backgroundColor: 'black',
        padding: 10,
        width: 200
    }
});

import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Entypo,SimpleLineIcons,Ionicons } from '@expo/vector-icons';


export default class Contact_compo_e extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.Contacts}>

                <View style={styles.condiv}>
                    <View >
                        <View   >
                            <Image source={{ uri: this.props.image }} style={{ width: "100%", height: 100 }} />
                        </View>

                        <View style={{ width: "100%" }}>
                            <View>
                                <Text style={styles.title}>{this.props.contact_name}</Text>
                            </View>
                            {/* <View>
                        <Text>Supplier :{this.props.supplier_name}</Text>
                    </View> */}
                            <View style={styles.inline_block}>
                                <Ionicons style={{marginRight:5}} name="ios-call" size={20} color="#000000" />
                                <Text>{this.props.phone}</Text>
                            </View>
                            <View style={styles.inline_block}>
                                <Entypo style={{marginRight:5}} name="email" size={18} color="#000000" />
                                <Text>{this.props.email}</Text>
                            </View>
                            <View style={styles.inline_block}>
                                <SimpleLineIcons style={{marginRight:5}} name="note" size={18} color="#000000" />
                                <Text>Note :{this.props.note.substring(0, 10)}...</Text>
                            </View>



                        </View>
                    </View>

                </View>


            </View>
        );
    }
}


// define your styles
const styles = StyleSheet.create({
    Contacts: {
        flex: 1,
        color: "#fff",
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        backgroundColor: '#fff',
        marginBottom: 10,
        marginRight: 10,
        paddingTop: 10
    },
    condiv: {
        width: 170,
        padding: 10
    },
    title: {
        fontSize: 15,
        fontWeight: "bold"
    },
    inline_block: {
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },

});
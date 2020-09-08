
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

class Contact_compo extends Component {


    render() {
        return (
            <View style={styles.Contacts}>
        
                <View style={styles.condiv}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: "25%" }}>

                            <Image source={{ uri: this.props.image }} style={{ width: 80, height: 100 }} />
                        </View>

                        <View style={{ width: "75%" }}>
                            <View>
                                <Text style={styles.title}>Contact : {this.props.contact_name}</Text>
                            </View>
                            <View>
                                <Text>Supplier :{this.props.supplier_name}</Text>
                            </View>
                            <View>
                                <Text>Phone :{this.props.phone}</Text>
                            </View>
                            <View>
                                <Text>Email :{this.props.email}</Text>
                            </View>
                            <View>
                                <Text>Note :{this.props.note}</Text>
                            </View>



                        </View>
                    </View>

                </View>


            </View>
        )
    }


}


// define your styles
const styles = StyleSheet.create({
    Contacts: {
        flex: 1,
        backgroundColor: 'red',
        color: "#fff",
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        backgroundColor: '#fff',
    },
    condiv: {
        width: "100%",
        padding: 10
    },
    title: {
        fontSize: 15,
        fontWeight: "bold"
    }


});
//make this component available to the app
export default Contact_compo;


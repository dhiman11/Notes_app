
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SimpleLineIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

export default class Product_compo_e extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.Products}>

                <View style={styles.prodiv}>
                    <View  >
                        <View   >
                            <Image source={{ uri: this.props.image }} style={{ width: "100%", height: 100 }} />
                        </View>

                        <View style={{ width: "100%" }}>
                            <View>
                                <Text style={styles.title}>{this.props.product_name}</Text>
                            </View>
                            
                         <View>  
                              <Text style={styles.fobprice}>Supplier :{this.props.product_id}</Text> 
                          </View>  

                            <View style={styles.inline_block}>
                                <FontAwesome style={{ marginRight: 5 }} name="dollar" size={20} color="#000000" />
                                <Text style={styles.fobprice}>{this.props.fob_price}</Text>
                            </View>
                          
                            <View style={styles.inline_block}>
                                <SimpleLineIcons style={{ marginRight: 5 }} name="note" size={18} color="#000000" />
                                <Text>{this.props.note.substring(0, 10)}...</Text>
                            </View>


                        </View>
                    </View>

                </View>


            </View>
        );
    }


}


const styles = StyleSheet.create({
    Products: {
        flex: 1,
        backgroundColor: 'red',
        color: "#fff",
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        backgroundColor: '#fff',
        marginBottom: 10,
        marginRight: 10,
    },
    prodiv: {
        width: 170,
        padding: 10
    },
    title: {
        fontSize: 15,
        fontWeight: "bold"
    },
    fobprice: {
        color: "red"
    },
    inline_block: {
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },

});
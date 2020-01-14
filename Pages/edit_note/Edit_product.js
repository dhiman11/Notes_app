import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput,Image,ScrollView } from 'react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { SQLite } from 'expo-sqlite';
import Image_slider from './Image_slider'; 
const db = SQLite.openDatabase('db.db'); 
const { width, height } = Dimensions.get('window');

export default class Edit_product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products_data: [],
            products_photos: [],
            loadingmore: false,
            product_name: '',
            fob_price: '',
            moq: '',
            notes: ''

        };
    }

    componentDidMount = async () => {

        let params = this.props.navigation.state.params;
        let product_id = params['product_id'];

        await this.get_data(product_id);
        await this.get_photos(product_id);

    }


    process_data = async (rows, type) => {

        if (type == "product") {
            console.log(rows._array[0]);

            await this.setState({
                product_name: rows._array[0].product_name,
                fob_price: rows._array[0].fob_price,
                moq: rows._array[0].moq,
                notes: rows._array[0].note,
                loadingmore: false
            })


        }

        if (type == "photos") {
            await this.setState({
                products_photos: [...this.state.products_photos, ...rows._array],
                loadingmore: false
            })
        }



    }

    get_data = async (product_id) => {
        await db.transaction(
            tx => {
                tx.executeSql('SELECT * from products '
                    + ' LEFT JOIN suppliers on suppliers.supplier_note_id = products.supplier_note_id '
                    + ' WHERE products.product_id =? ', [product_id], (_, { rows }) =>

                        this.process_data(rows, 'product')
                );

            },
        );

    }

    get_photos = async (product_id) => {
        await db.transaction(
            tx => {
                tx.executeSql('SELECT * from photos '
                    + ' WHERE connect_table ="products" AND connect_id = ? ', [product_id], (_, { rows }) =>

                        this.process_data(rows, 'photos')
                );

            },
        );

    }



    render() {
        return (
            <ScrollView>
                <Image_slider style={{marginBottom:30}} Images_data={this.state.products_photos} />
               
                <TextInput
                        value={String(this.state.product_name)}
                        style={{position:"absolute",top:300,fontSize:28,fontWeight:"bold",color:"#fff",paddingLeft:10}}
                        textAlign="left"
                        // autoFocus={true} 
                        onChangeText={(text) => this.setState({ product_name: text })}
                        placeholderTextColor='#818181'
                        placeholder="Product Name*"
                        // ref={component => this._textInput1 = component}
                    />

                <View style={styles.input_container}> 

                    <Text style={styles.label}>Fob price</Text>
                  
                    <TextInput
                        value={String(this.state.fob_price)}
                        style={styles.inputfields} 
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ fob_price: text })}
                        placeholderTextColor='#818181'
                        placeholder="Fob price"
                        // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Moq</Text>
                    <TextInput
                        value={String(this.state.moq)}
                        style={styles.inputfields}
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ moq: text })}
                        placeholderTextColor='#818181'
                        placeholder="Moq"
                        // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Note</Text>
                    <TextInput
                        value={String(this.state.notes)}
                        multiline={true}
                        style={styles.inputfields}
                        textAlign="left"
                        onChangeText={(text) => this.setState({ notes: text })}
                        placeholderTextColor='#818181'
                        placeholder="Note"
                        // ref={component => this._textInput1 = component}
                    />



              
                <Text style={styles.label}>All Images</Text>
               
                {
                       
                       this.state.products_photos.map((item, index) => ( 
                           <View key={index} style={styles.bulk_images}>
                               <Image
                                   style={this.state.zoomimage ? styles.zoom_images :styles.images }
                                   source={{ uri: item.file_name }} /> 
                                 
                           </View>
                       ))
                   }  
               
                 </View> 
            </ScrollView>
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
    buttons: {
        alignItems: "flex-end",
        textAlign: "center",
        marginTop: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    add_supp: {
        backgroundColor: '#176fc1',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        minWidth: 130,
        maxWidth: 130,

    },
    button: {
        width: '20%'
    },
    label: {
        fontWeight: "bold",
        marginTop: 10,
    },
    inputfields: {
        alignSelf: 'stretch',
        opacity: 0.4, 
        fontSize: 18,
        backgroundColor: "#fff",
        maxHeight: 40,
        minWidth: 300,
        borderColor: "#fff",
        borderWidth: 1,
       
    },
    response: {
        fontSize: 20,
        color: "red",
        marginBottom: 0
    },
    heading: {
        fontSize: 18,
        fontWeight: "normal",
        borderColor: "#176fc1",
        borderWidth: 1,
        backgroundColor: "#176fc1",
        color: "#fff",
        padding: 5,
        marginBottom: 10
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    input_container: {
        paddingLeft: 10,
        paddingRight: 10
    },
    images: {
        width: width-20,
        height: 350
    },
    zoom_images: {
        width: width-20,
        height: height
    },
    bulk_images:{
        marginBottom:10
    }
});
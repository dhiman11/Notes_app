import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput,Image,ScrollView } from 'react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { SQLite } from 'expo-sqlite';
import Image_slider from './Image_slider'; 
const db = SQLite.openDatabase('db.db'); 
const { width, height } = Dimensions.get('window');

export default class Edit_contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts_data: [],
            contacts_photos: [],
            loadingmore: false,
            contact_name: '',
            email: '',
            phone: '',
            position: '',
            notes: ''

        };
    }

    componentDidMount = async () => {

        let params = this.props.navigation.state.params;
        let contact_id = params['contact_id'];

        await this.get_data(contact_id);
        await this.get_photos(contact_id);

    }


    process_data = async (rows, type) => {

        if (type == "contact") {
            console.log(rows._array[0]);

            await this.setState({
                contact_name: rows._array[0].contact_name,
                email: rows._array[0].email,
                phone: rows._array[0].phone,
                position: rows._array[0].position,
                notes: rows._array[0].note,
                loadingmore: false
            })


        }

        if (type == "photos") {
            await this.setState({
                contacts_photos: [...this.state.contacts_photos, ...rows._array],
                loadingmore: false
            })
        }



    }

    get_data = async (contact_id) => {
        await db.transaction(
            tx => {
                tx.executeSql('SELECT * from contacts '
                    + ' LEFT JOIN suppliers on suppliers.supplier_note_id = contacts.supplier_note_id '
                    + ' WHERE contacts.contact_id =? ', [contact_id], (_, { rows }) =>

                        this.process_data(rows, 'contact')
                );

            },
        );

    }

    get_photos = async (contact_id) => {
        await db.transaction(
            tx => {
                tx.executeSql('SELECT * from photos '
                    + ' WHERE connect_table ="contacts" AND connect_id = ? ', [contact_id], (_, { rows }) =>

                        this.process_data(rows, 'photos')
                );

            },
        );

    }



    render() {
        return (
            <ScrollView>
                <Image_slider style={{marginBottom:30}} Images_data={this.state.contacts_photos} />
               
                <TextInput
                        value={String(this.state.contact_name)}
                        style={{position:"absolute",top:300,fontSize:28,fontWeight:"bold",color:"#fff",paddingLeft:10}}
                        textAlign="left"
                        // autoFocus={true} 
                        onChangeText={(text) => this.setState({ contact_name: text })}
                        placeholderTextColor='#818181'
                        placeholder="Contact Name*"
                        // ref={component => this._textInput1 = component}
                    />

                <View style={styles.input_container}> 

                    <Text style={styles.label}>Position</Text>
                  
                    <TextInput
                        value={String(this.state.position)}
                        style={styles.inputfields} 
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ position: text })}
                        placeholderTextColor='#818181'
                        placeholder="Position"
                        // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        value={String(this.state.phone)}
                        style={styles.inputfields}
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ phone: text })}
                        placeholderTextColor='#818181'
                        placeholder="Phone"
                        // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={String(this.state.email)}
                        multiline={true}
                        style={styles.inputfields}
                        textAlign="left"
                        onChangeText={(text) => this.setState({ email: text })}
                        placeholderTextColor='#818181'
                        placeholder="Note"
                        // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Notes</Text>
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
                       
                       this.state.contacts_photos.map((item, index) => ( 
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
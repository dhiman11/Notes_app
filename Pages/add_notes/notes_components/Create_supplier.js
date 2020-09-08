//import liraries
import React, { Component } from 'react';
import { View, FlatList, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, AsyncStorage } from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import Images_upload_view from './Images_upload_view.js';
import { SafeAreaView } from 'react-navigation';
import * as Permissions from 'expo-permissions';
 

////////////////////SQLLITE CONNECTION
import { SQLite } from 'expo-sqlite';
import { insert_supplier } from '../../models/all_models.js';
const db = SQLite.openDatabase('db.db');
//////////////////////////////////////

class Create_supplier extends Component {


    constructor(props) {
        super(props);
        //////////////////
        this.state = {
            user_id: 0,
            user_name: '',
            event_id: 0,
            lastsupp: [],
            supplier_name: '',
            supplier_id: 0,
            notes: '',
            images: [],
            response: ' ',
            isCapturing: false,
            show_s_create_btn: false

        }
        ///////////////////



    }

    componentDidMount() {  
        this.setState({
            event_id: this.props.event_id,
            event_name: this.props.event_name,
        })
    }

    //CLOSE MODAL////
    /////////////////
    close_modal = (value)=>{  
            this.props.handle_visibility(value); 
        }  
 
 

 

    /////////////////GET COOKIES DATA /////////////////////
    ///////////////////////////////////////////////////////





    /* ************************************************ */
    // Choose images from camera
    /* ************************************************ */
    /* ************************************************ */ 
    choose_images = async () => { 
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL); 
        if (status == 'granted') {
            // alert('Sorry, we need camera roll permissions to make this work!');
            // alert(status)
        } else {
            // alert(status)
        } 
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [4, 3],
            base64: true,
            quality:0.5
        });

        // console.log(result.base64);
        var img_array = []; 
        if(result.base64){
            img_array.push(result.base64);
        }else{ 
        }  
        this.setState({
            images: [...this.state.images, ...img_array]
        });   
    }
    /* ************************************************ */
    /* ************************************************ */
    /* ************************************************ */

    // Click images from camera 
    ///////////////////////////
    click_images = async () => { 
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            // alert('Sorry, we need camera roll permissions to make this work!');

        } 
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            base64: true,
            quality:0.5
        });
  
        var img_array = []; 
        if(result.base64){
            img_array.push(result.base64);
        }else{ 
        }

        this.setState({
            images: [...this.state.images, ...img_array]
        });
 
    }



    ////// Set supplier id for the contact
    //////////////////////////////////////
    update_supp_id = (val1) => { 
        this.setState({
            supplier_id: val1.supplier_id,
            supplier_name: val1.suppliername,
            show_s_create_btn: false
        });   
    }

 
 

    ////// POST Form data //////////////////
    //////////////////////////////////////
    fetchdata = () => {

        this.setState({
            response: " Note: Please wait we saving your data .... ",
        });
        
        /* ****************** */
        /* SUPPLIER FORM DATA */
        /* ****************** */
        let eventid = this.state.event_id;
        let supplier_name = this.state.supplier_name; 
        let notes = this.state.notes;
        let images = this.state.images;

        /* ************************ */
        /* IF SUPPLIER IS NOT EMPTY */
        /* ************************ */
        if (supplier_name != '') {
            insert_supplier(eventid, supplier_name, notes, images).then((response) => {
                var supp_data = JSON.parse(response);
                if(supp_data){
                    
                }
                this.close_modal(false);
                // console.log(supp_data);
                // this.setState({
                //     all_suppliers: supp_data.data
                // });
            });
        /* ************************ */
        /* ************************ */   
        } else {
            alert('Please Fill Supplier name ');
            this.setState({
                response: "Please Fill Supplier name "

            })
        }

    }


    render() {

        return (

            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View >
                        <Text style={{ fontSize: 22, marginBottom: 10, fontWeight: "bold", color: "#000000" }}>{this.state.event_name}</Text>



                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ supplier_name: text })}
                                placeholderTextColor='#818181'
                                placeholder="Supplier Name"
                                ref={component => this._textInput2 = component}

                            />
                        </View>


                        <View>
                            <TextInput
                                multiline={true}
                                numberOfLines={10}
                                style={styles.textarea}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ notes: text })}
                                placeholderTextColor='#818181'
                                placeholder="Notes"
                                ref={component => this._textInput5 = component}
                            />
                        </View>
                        {/* <Image 
                        style ={{width:25,height:25}}
                        source={require('../assets/img/search.png')}
                         /> */}


                        <View>
                            <Text style={styles.response}>{this.state.response}</Text>
                        </View>
                        {/* <View style={{alignItems:"center",alignContent:"center"}}>
                                    <TouchableOpacity
                                //  onPress={() => {this.submitForm()}}
                                    style={{backgroundColor:"#176fc1",width:100,paddingLeft:20,paddingRight:20,paddingTop:10,paddingBottom:10}}>
                                        <Text style={{color:"#fff"}}>Save</Text>
                                    </TouchableOpacity>
                                </View> */}
                        <View style={styles.buttons}>

                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={() => { this.choose_images() }}
                                    style={{ width: 40 }}>
                                    <Image
                                        source={require('../../../assets/img/gallery.png')}
                                        style={{ width: 40, height: 40, marginLeft: 8 }}
                                    />
                                    {/* <Text style={{color:"#000000"}}> GALLERY</Text> */}
                                </TouchableOpacity>
                            </View>




                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={() => { this.click_images() }}
                                    style={{ width: 40 }}>
                                    <Image
                                        source={require('../../../assets/img/camera.png')}
                                        style={{ width: 40, height: 40, marginLeft: 8 }}
                                    />
                                    {/* <Text style={{color:"#000000"}}>CAMERA</Text> */}
                                </TouchableOpacity>
                            </View>




                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={() => { this.fetchdata() }}
                                    style={{ textAlign: "center", backgroundColor: "#176fc1", width: 100, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                                    <Text style={{ color: "#fff", textAlign: "center" }}>SAVE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View>
                            <FlatList
                                numColumns={3}
                                data={this.state.images}
                                //data={this.state.images} 
                                //Item Separator View this.state.lastsuppliers
                                renderItem={({ item }) => (
                                    <Images_upload_view base64img={item} />
                                )}
                                ListFooterComponent={this.renderFooter}
                                keyExtractor={(item, index) => index.toString()}

                            />
                        </View>





                    </View>
                </ScrollView>
            </SafeAreaView>
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

    inputfields: {
        alignSelf: 'stretch',
        opacity: 0.4,
        marginTop: 15,
        fontSize: 18,
        backgroundColor: "#fff",
        maxHeight: 40,
        minWidth: 300,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 15
    },
    textarea: {
        alignSelf: 'stretch',
        opacity: 0.4,
        marginTop: 15,
        fontSize: 18,
        backgroundColor: "#fff",
        maxHeight: 150,
        minWidth: 300,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 15,
        textAlignVertical: 'top',
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
    }
});


//make this component available to the app
export default Create_supplier;

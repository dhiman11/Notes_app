//import liraries
import React, { Component } from 'react';
import { View, FlatList, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, AsyncStorage, Picker } from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import Last_supplier from './Last_supplier.js';
import Images_upload_view from './Images_upload_view.js';
import { SafeAreaView } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

////////////////////SQLLITE CONNECTION
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
//////////////////////////////////////

class Create_product extends Component {


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
            product_name: '',
            supp_ref: '',
            fobusd: '',
            moq: '',
            notes: '',
            product_categories: [],
            product_category: 0,
            images: [],
            response: ' ',
            isCapturing: false,
            show_s_create_btn: false

        }
        ///////////////////



    }

    componentDidMount() {

        if(this.props.single_supp){
            this.setState({
                supplier_id: this.props.supp_id,
                supplier_name: this.props.suppliername,
            })
        }else{

        }


        //////// Create the contacts database if not existed///////////
        db.transaction(tx => {
           
            tx.executeSql("create table if not exists products ("
                + "product_id	INTEGER PRIMARY KEY AUTOINCREMENT,"
                + "supplier_note_id	INTEGER,"
                + "product_name	TEXT,"
                + "sync_id	INTEGER,"
                + "sync_status	text,"
                + "supplier_reference	TEXT,"
                + "fob_price	INTEGER,"
                + "moq	INTEGER,"
                + "note	TEXT,"
                + "main_photo_id	INTEGER)", [],
                () => console.log("created"),
                (a, b) => console.log(b)
            );
        });

        //////// Create the suppliers database if not existed///////////
        db.transaction(tx => {
          
            tx.executeSql("create table if not exists suppliers ("
            + "supplier_note_id	INTEGER PRIMARY KEY AUTOINCREMENT,"
            + "supplier_name	TEXT,"
            + "event_id	INTEGER,"
            + "sync_id	INTEGER,"
            + "sync_status	text,"
            + "notes	text)", [],
            () => console.log("created"),
            (a, b) => console.log(b)
        );
        });

        //////// Create the photos database if not existed///////////
        db.transaction(tx => {
            
            tx.executeSql("create table if not exists photos ("
                + "photo_id	INTEGER PRIMARY KEY AUTOINCREMENT,"
                + "file_name TEXT,"
                + "sync_id	INTEGER,"
                + "sync_status	text,"
                + "connect_table TEXT,"
                + "connect_id INTEGER,"
                + "path	TEXT)", [],
                () => console.log("created"),
                (a, b) => console.log(b)
            );
        });





        /////////////////////////////////////////////////////

        this.getData();
        this.con_pro_data();




    }

    /////////////////GET COOKIES DATA /////////////////////
    ///////////////////////////////////////////////////////
    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('selected_event_id');
           
            ///////////////////////     
            this.setState({
                event_id: value,
            });
            //////////////////////////
            if (value !== null) {
                // value previously stored
            }
        } catch (e) {
            // error reading value
        }
    }







    con_pro_data = () => {


        db.transaction(
            tx => {
                ////////////////////////////// SELECT ALL event ////////////
                tx.executeSql('SELECT * from suppliers ORDER BY supplier_note_id DESC LIMIT 3 ', [], (_, { rows }) =>
                    this.setState({
                        lastsupp: rows._array
                    })
                );

            },
        );

    }



    // Choose images from camera
    ///////////////////////////
    choose_images = async () => {

        const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);

        if (status !== 'granted') {
            // alert('Sorry, we need camera roll permissions to make this work!');

        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false
        });


        var img_array = [];

        img_array.push(result.uri);


        this.setState({
            images: [...this.state.images, ...img_array]
        });

        // console.log(this.state.images);

    }

    // Click images from camera 
    ///////////////////////////
    click_images = async () => {

        const { status } = await Permissions.getAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            // alert('Sorry, we need camera roll permissions to make this work!');

        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            base64: false
        });

        var img_array = [];
        img_array.push(result.uri);
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
            show_s_create_btn: false,
           
        });

     console.log(val1);



    }

    ///////////////////////////////////////

    //// Create new supplier////

    create_new_supplier = async () => {

        let event_id = await AsyncStorage.getItem('selected_event_id');

        db.transaction(
            tx => {

                tx.executeSql('insert into suppliers (supplier_name,event_id) values (?,?)', [this.state.supplier_name, event_id],
                    (success) => this.setState({
                        show_s_create_btn: false
                    }),
                    (error) => console.log(error)
                );

                tx.executeSql('SELECT last_insert_rowid() as last_id', [], (_, { rows }) =>

                    this.setState({
                        supplier_id: rows._array[0].last_id,
                    }),


                );



            },
        );

        await AsyncStorage.setItem('selected_supp__id', JSON.stringify(this.state.supplier_id));
        this.con_pro_data();
    }



    cerate_folder_if_not_existed = async () => {

        try {
            let folder = FileSystem.documentDirectory + "mgsnotes"
            await FileSystem.makeDirectoryAsync(folder, {
                intermediates: true
            })

            var fi = await FileSystem.getInfoAsync(folder);

            console.log(JSON.stringify(fi))
        } catch (error) {
            console.log(error)
        }

    }


    insert_images = async (product_id, format = 'jpg') => {

        // console.log(this.state.images);
        this.cerate_folder_if_not_existed();

        let images = this.state.images;

        if (images.length > 0) {

            for (var i = 0; i < images.length; i++) {
                let filemane = "product_img_" + product_id + "_" + i + "." + format;

                console.log('new_filename: - ' + filemane);
                console.log("old_file_path:" + images[i]);
                console.log("new_file_path:" + FileSystem.documentDirectory + 'mgsnotes/' + filemane);
                /////INSERT IMAGES ///////////////////

                //////////////////////////////////////

                let new_path = FileSystem.documentDirectory + 'mgsnotes/' + filemane;

                await FileSystem.moveAsync({
                    from: images[i],
                    to: new_path
                }).catch(error => {
                    console.error(error);
                })


                ////////////Save images inside database

                db.transaction(
                    tx => {
                        tx.executeSql('insert into photos (file_name,connect_table,connect_id) values (?,?,?)', [new_path, 'products', product_id],
                            (success) => this.setState({
                                response: " Data saved  ",
                                images: []
                            }),
                            (error) => console.log(error)
                        );

                        //////////////////////////// 
                        tx.executeSql('SELECT * from photos', [], (_, { rows }) =>
                            console.log(rows)
                        );
                        //////////////////

                    }
                );

            }



        }

    }


    ////// POST Form data//////////////////
    //////////////////////////////////////
    fetchProductdata = async() => {

        this.setState({
            response: " Note: Please wait we saving your data .... ",
        });



        // + "product_id	INTEGER PRIMARY KEY AUTOINCREMENT,"
        // + "supplier_note_id	INTEGER,"
        // + "product_name	TEXT,"
        // + "supplier_reference	TEXT,"
        // + "fob_price	TEXT,"
        // + "moq	TEXT,"
        // + "note	TEXT,"
        // + "main_photo_id
   

        let eventid = this.state.event_id;
        let supplier_name = this.state.supplier_name;
        let supplier_id = this.state.supplier_id;
        let product_name = this.state.product_name;
        let supp_ref = this.state.supp_ref;
        let fobusd = this.state.fobusd;
        let moq = this.state.moq;
        let notes = this.state.notes;
        let images = this.state.images;



        if(supplier_name !='' ){
             if(product_name !='' ){

            if (images.length > 0){
                    db.transaction(
                        tx => {

                            tx.executeSql('insert into products (product_name,supplier_note_id,supplier_reference,fob_price,moq,note) values (?,?,?,?,?,?)', [product_name,supplier_id, supp_ref, fobusd, moq, notes],
                                (success) => this.setState({
                                    response: " Data saved  "

                                }),
                                (error) => console.log(error)
                            );

                            //////////////////////////////////
                            tx.executeSql('SELECT last_insert_rowid() as last_id', [], (_, { rows }) =>

                                this.insert_images(rows._array[0].last_id)

                            )

                        },
                    );
                    }else{
                        alert('Please Choose images  ');
                        this.setState({
                            response: " Please choose images " 
                        })
                    }
                }else{
                    alert('Please Fill Product name ');
                    this.setState({
                        response: "Please Fill Product name  "
                        
                    })
                }
                }else{
                    alert('Please Fill Supplier name ');
                    this.setState({
                        response: "Please Fill Supplier name  "
                        
                    })
                }

    }


    render() {

        return (

            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View >

                        <View>
                            <Text style={{ fontSize: 22, marginBottom: 10, fontWeight: "bold", color: "#000000" }}>CREATE PRODUCT</Text>
                          
                            {this.props.single_supp?
                            <Last_supplier update_supp_id={this.update_supp_id.bind(this)} suppliername={this.props.suppliername} supplier_id={this.props.supp_id}   />:
                
                            <FlatList
                                numColumns={3}
                                data={this.state.lastsupp}
                                //Item Separator View this.state.lastsuppliers
                                renderItem={({ item }) => (
                                     
                                    <Last_supplier update_supp_id={this.update_supp_id.bind(this)} suppliername={item.supplier_name} supplier_id={item.supplier_note_id} data={item} />

                                )}

                                ListFooterComponent={this.renderFooter}
                                keyExtractor={(item, index) => index.toString()}
 
                                /> }


                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) =>
                                    this.setState({
                                        supplier_name: text,
                                        show_s_create_btn: true
                                    })
                                }
                                placeholderTextColor='#818181'
                                placeholder="Supplier Name*"
                                value={this.state.supplier_name}
                            />
                            {this.state.show_s_create_btn ?
                                <TouchableOpacity  style={styles.add_supp} onPress={() => { this.create_new_supplier() }} >
                                    <Text style={{color:"#fff"}}>Add This Supplier</Text>
                                </TouchableOpacity> : null
                            }
                        </View>

                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ product_name: text })}
                                placeholderTextColor='#818181'
                                placeholder="Product Name*"
                                ref={component => this._textInput1 = component}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ supp_ref: text })}
                                placeholderTextColor='#818181'
                                placeholder="Supp. Ref"
                                ref={component => this._textInput2 = component}

                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ fobusd: text })}
                                placeholderTextColor='#818181'
                                placeholder="FOB USD"
                                keyboardType={'phone-pad'}
                                ref={component => this._textInput3 = component}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ moq: text })}
                                placeholderTextColor='#818181'
                                placeholder="MOQ"
                                keyboardType={'phone-pad'}
                                ref={component => this._textInput4 = component}
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
                        <View>
                            <Text style={styles.response}>{this.state.response}</Text>
                        </View>

                        <View>
                            <Text>Product Category</Text>
                        </View>

                        <View>
                            <Picker
                                mode="dropdown"
                                selectedValue={this.state.product_category}
                                onValueChange={(value) => {
                                    this.setState({
                                        product_category: value
                                    });
                                }} >
                                {this.state.product_categories.map((item, index) => {
                                    return (<Picker.Item label={item.category_name} value={item.id} key={index} />)
                                })}
                            </Picker>
                        </View>

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
                                    onPress={() => { this.fetchProductdata() }}
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
    add_supp:{
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
export default Create_product;

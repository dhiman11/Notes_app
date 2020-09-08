
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, AsyncStorage } from 'react-native';
import Add_contact_products from './Add_contact_products';
 
import My_events from './events_components/My_events';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Add_event_modal from '../modals/Add_event_modal';
 
import Sync_model from '../modals/Sync_model';
 
import { MaterialIcons } from '@expo/vector-icons';
import { load_events } from '../models/all_models';
import { cookies } from '../Settings';


const  get_cookie_data = async ()=> {
    try {
        const jsonValue = await cookies;
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch(e) {
        // error reading value
      }
}

export default class Add_events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_event_id: null,
            user_id: null,
            create_event_modal: false,
            create_con_pro: false,
            Events_list: [],
            Last_events_list: [],
            headername: null,
            sync_model: false
        }
     
    
    }



    componentDidMount=async()=> {
     
        
        await get_cookie_data().then((response)=>{
            console.log(response);
            this.setState({
                    user_id:response.user_id
            });  
              this.get_data(response.user_id);

        })      
        // try {
        //     const value = await cookies;
        //     if (value !== null) {
        //         // We have data!!
        //         var event_data   = JSON.parse(value);
        //         this.setState({
        //                 user_id:event_data.user_id
        //         })   
             
        //         await this.get_data(this.state.user_id); 
        //     }
        // } catch (error) {
        //     console.log("error");
        // }


        // await cookies.then((obj)  => {
        //     var data =     JSON.parse(obj);  
        //     this.setState({
        //         user_id:data.user_id
        //     })   
        //  });

        //    
    }

    get_data = async (user_id) => { 
        ////++++++++++++++++++++++++++++++++++++++++++++++
        ////////////////////////ALL EVENTS start///////// 
        ////++++++++++++++++++++++++++++++++++++++++++++++
  
       await load_events(0,user_id).then((response) => { 

            var event_data   = JSON.parse(response);
            this.setState({
                Events_list:event_data.Events_list,
                Last_events_list:event_data.Last_events_list
            });

        });
        
 
        ////++++++++++++++++++++++++++++++++++++++++++++++
        ////////////////////////ALL EVENTS ends //////////
        ////++++++++++++++++++++++++++++++++++++++++++++++





    }

    _c_event_pop = (value) => {

        this.setState({
            create_event_modal: value
        });
        this.get_data(this.state.user_id);

    }

    syn_popup = (value) => {

        this.setState({
            sync_model: value
        });


    }


    ////////////////////////////
    ///////////////////////////
    _c_con_pro_pop = (value) => {
        this.setState({
            create_con_pro: value
        });
    }


    ////////////////////////////
    ///////////////////////////
    sync_popup = (value) => {
        this.setState({
            sync_model: value
        });
    }

    ////Contact Product Popup ////////
    ////////////////////////////
    notePopup = (event_id) => {
        this.setState({
            create_con_pro: true,
            selected_event_id: event_id
        });


        this.storeData(event_id);
    }
    //////////////////////////
    /////////////////////////
    /////// Store selected_event_id ///////
    storeData = async (event_id) => {

        try {
            await AsyncStorage.setItem('selected_event_id', event_id.toString())
            console.log('event_id saved' + event_id);

        } catch (e) {
            console.log(e);
        }
    }

    ///////////////////////
    //////////////////////////
    // GO to supplier page 
    load_suppliers = async (event) => {
        // console.log(event.event_id);

        this.props.navigation.navigate('Add_supp', {
            event_id: event.event_id,
            event_name: event.event_name
        });
    }



    render() {
     
        return (


            <View style={styles.container} >
                {this.state.create_event_modal ? <Add_event_modal updateState={this._c_event_pop.bind(this)} modalvisibility={this.state.create_event_modal} /> : null}

                {this.state.create_con_pro ? <Add_contact_products selected_event_id={this.state.selected_event_id} updateState={this._c_con_pro_pop.bind(this)} modalvisibility={this.state.create_con_pro} /> : null}
                {this.state.sync_model ? <Sync_model sync_popup={this.sync_popup.bind(this)} modalvisibility={this.state.sync_model} /> : null}

                <View>
                    <View style={styles.inline_block}>
                        <TouchableOpacity onPress={() => { this._c_event_pop(true) }} >
                            <MaterialIcons name="add-circle-outline" size={60} color="#000000" />
                            <Text style={styles.eventname}>ADD EVENT</Text>
                        </TouchableOpacity>




                        <TouchableOpacity style={{ position: "absolute", right: 0 }} onPress={() => { this.syn_popup(true) }} >
                            <Image style={{ width: 60, height: 60, marginRight: 15 }}
                                source={require('../../assets/img/sync.png')}
                            />
                            <Text style={styles.eventname}>SYNC</Text>
                        </TouchableOpacity>


                    </View>



                    <Text style={styles.heading}>RECENT EVENTS</Text>
                    <FlatList
                        numColumns={3}
                        data={this.state.Last_events_list}
                        //Item Separator View
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            
                            <My_events load_supplier_page={this.load_suppliers.bind(this)} updateState={this.notePopup.bind(this)} eventid={item.event_id} eventname={item.event_name}  eventcity={item.city} eventon={item.from_date} />
                        )}
                    />

                </View>
                <Text style={styles.heading}>ALL EVENTS</Text>
                <FlatList
                    numColumns={4}
                    data={this.state.Events_list}
                    //Item Separator View
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (

                        <My_events load_supplier_page={this.load_suppliers.bind(this)} updateState={this.notePopup.bind(this)} eventid={item.event_id} eventname={item.event_name} eventcity={item.city} eventon={item.from_date} />

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
        // flexDirection: 'row', 
        // alignSelf: 'flex-start'
    }
});



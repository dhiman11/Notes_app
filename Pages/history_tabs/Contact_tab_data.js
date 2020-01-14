import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator,TouchableOpacity } from 'react-native';

import { SQLite } from 'expo-sqlite';
import Contact_compo from '../History_components/Contact_compo';
import Edit_contact from '../edit_note/Edit_contact';
const db = SQLite.openDatabase('db.db');

export default class Contacts_tab_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts_data: [],
            loadmore_test: '',
            isRefreshing: false,
            loadingmore: false,
            history_array: [],
            limit: 0,
        };
    }

    componentDidMount() {
        // this.get_data(this.state.limit);
        this.props.navigation.addListener('willFocus', (route) => {
            this._onRefresh();
        });
    }

    process_data = (rows) => {

        this.setState({
            contacts_data: [...this.state.contacts_data, ...rows._array],
            loadingmore: false
        })
    }

    get_data = (limit) => {

        db.transaction(
            tx => {
                tx.executeSql('SELECT * from contacts '
                    + ' LEFT JOIN suppliers on suppliers.supplier_note_id = contacts.supplier_note_id '
                    + ' LEFT JOIN photos ON photos.connect_id = contacts.contact_id'
                    + ' WHERE photos.connect_table ="contacts" '
                    + ' GROUP BY contacts.contact_id '
                    + ' ORDER BY contacts.contact_id DESC  LIMIT ' + limit + ',20', [], (_, { rows }) =>

                        this.process_data(rows)


                );

            },
        );


    }

    _onRefresh = () => {
        this.setState({ isRefreshing: true })
        this.setState({ contacts_data: [] })
        this.setState({ limit: 0 })
        this.get_data(0);
        this.setState({ isRefreshing: false })
        this.setState({ loadmore_test: ' ', });
    }

    ///// LOAD MORE ////////////////////
    handleLoadMore = () => {

        this.setState({ loadmore_test: 'Loading...', });
        var limit = parseInt(this.state.limit) + parseInt(20);  // increase page by 1
        this.setState({ limit: limit });
        this.get_data(limit);  // method for API call 
        this.setState({ loadmore_test: 'Scroll down to load more', });

    };

    //////////////EDIT PRODUCT OR CONTACT
    edit_it = (id, type) => {
        this.props.navigation.navigate('Edit_contact', {
            contact_id: id
        });
    }


    render() {
        return (
            <View style={styles.container}>

                {this.state.loadingmore &&
                    <ActivityIndicator animating={this.state.loadingmore} size="large" color="red" />
                }
                <FlatList
                    numColumns={1}
                    data={this.state.contacts_data}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={3}
                    onEndReached={this.handleLoadMore.bind(this)}
                    renderItem={({ item, index }) => (



                        <View>
                            <TouchableOpacity onPress={() => { this.edit_it(item.contact_id) }}>
                                <Contact_compo note={item.note} phone={item.phone} email={item.email} supplier_name={item.supplier_name} contact_name={item.contact_name} image={item.file_name} />
                            </TouchableOpacity>
                        </View>

                    )}
                />

                <View>
                    <Text>{this.state.loadmore_test}</Text>
                </View>


            </View>

        );
    }

}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',


    },
    heading: {
        fontSize: 22,
        color: "#000000",
        marginTop: 10,
        width: 100,
        marginBottom: 20,
        fontWeight: "bold"
    }
});
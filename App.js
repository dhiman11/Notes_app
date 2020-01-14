import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import Login from './Pages/Login';
import Home_page from './Pages/Home_page';


////////////////////SQLLITE CONNECTION
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
////////////////////////////////////// 

class App extends Component {

  componentDidMount() {
    StatusBar.setHidden(true);


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



    db.transaction(tx => {

      tx.executeSql("create table if not exists contacts ("
        + "contact_id	INTEGER PRIMARY KEY AUTOINCREMENT,"
        + "supplier_note_id	INTEGER,"
        + "sync_id	INTEGER,"
        + "sync_status	text,"
        + "contact_name	TEXT,"
        + "position	TEXT,"
        + "phone	NUMERIC,"
        + "email	TEXT,"
        + "note	TEXT,"
        + "main_photo_id	INTEGER)", [],
        () => console.log("created"),
        (a, b) => console.log(b)
      );
    });


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
  }

  render() {
    return (
      <Home_page />
    );
  }
}



export default App;

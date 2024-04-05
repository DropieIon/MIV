import React from 'react';
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

import ViewStyles from '../ListStyles';
import { AntDesign } from '@expo/vector-icons';


const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    elevation: 5,
    width: "90%",
    height: "60%",
    position: "absolute",
    borderRadius: 200,
    backgroundColor: 'white'
  },
  textInput: {
    flex: 10,
    padding: 10,
  },
  searchIcon: {
    verticalAlign: 'middle',
    textAlign: 'center',
    right: "30%"
  }
});

function SearchBar (props){
  const {
    onChange
  } = props;
  return (
    <View
      style={[ViewStyles.item_name, styles.searchBox]}
    >
      <TextInput
        onChangeText={onChange}
        style={styles.textInput}
        placeholder={"Search for..."}
      ></TextInput>
      <AntDesign
        name="search1"
        size={15}
        color="#68A2F2"
        style={styles.searchIcon} 
      />

    </View>
  );
}

export default SearchBar;
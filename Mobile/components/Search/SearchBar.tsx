import React from 'react';
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

import ViewStyles from '../Templates/DefaultViewStyles';

const styles = StyleSheet.create({
  searchBox: {
    left: ViewStyles.item_img.width,
    position: "absolute",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    textAlign: 'center'
  }
});

function SearchBar (props){
  return (
    <View
      style={[ViewStyles.item_name, styles.searchBox]}
    >
      <TextInput
        style={styles.textInput}
        placeholder={"Search for..."}
      ></TextInput>

    </View>
  );
}

export default SearchBar;
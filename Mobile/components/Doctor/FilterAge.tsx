import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

import ViewStyles from '../Templates/DefaultViewStyles';

const styles = StyleSheet.create({
  FilterAge: {
    left: "60%",
    position: "absolute",
    // backgroundColor: "orange",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  }
});

function FilterAge(props) {
  const handlePress = () => {
    console.log("Merge");

  }
  return (
    <View
      style={[ViewStyles.item_age, styles.FilterAge]}
    >
      <TextInput
        style={{ textAlign: 'center', flex: 1 }}
        placeholder='Age'
        keyboardType='numeric'
      ></TextInput>

    </View>
  );
}

export default FilterAge;
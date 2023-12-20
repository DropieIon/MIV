import React from 'react';
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

const styles = StyleSheet.create({
  FilterAge: {
    height: "100%",
    width: "40%",
    left: "60%",
    position: "absolute",
    // backgroundColor: "orange",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  }
});

function FilterDate(props) {
  const handlePress = () => {
    console.log("Merge");

  }
  return (
    <View
      style={styles.FilterAge}
    >
      <TextInput
        style={{textAlign: 'center', flex: 1}}
        placeholder='Date'
        keyboardType='numeric'
      ></TextInput>

    </View>
  );
}

export default FilterDate;
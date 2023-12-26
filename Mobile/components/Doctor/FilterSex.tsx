import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';


const styles = StyleSheet.create({
  FilterSex: {
    height: "100%",
    width: "20%",
    left: "80%",
    position: "absolute",
    //   backgroundColor: "orange",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  text_filter: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown: {
    display: 'none',
    opacity: 0,
    height: 0,
    width: 0,
  }
});

function FilterSex(props) {
  let ref = useRef(null);
  const [selectedSex, setSelectedSex] = useState('All');
  const handleOpenPicker = () => {
    ref?.current.focus();
  };
  return (
    <TouchableOpacity
      onPress={handleOpenPicker}
      style={styles.FilterSex}
    >
      <Text
        style={styles.text_filter}
      >
        {selectedSex}
      </Text>
      <Picker
        mode='dialog'
        ref={ref}
        selectedValue={selectedSex}
        onValueChange={(selectedSex, itemIndex) => setSelectedSex(selectedSex)}
        style={styles.dropdown}
      >
        <Picker.Item label="M" value="M" />
        <Picker.Item label="F" value="F" />
        <Picker.Item label="All" value="All" />
      </Picker>
    </TouchableOpacity>
  );
}

export default FilterSex;
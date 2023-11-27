import React, { Component, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
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
    flex:1,
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

class FilterSex extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  ref;
  state = {
    selectedSex: 'All',
  };
  handleOpenPicker = () => {
    this.ref.current.focus();
  };
  componentDidMount(): void {
  }
  render(): React.ReactNode {

    return (
      <TouchableOpacity
        onPress={this.handleOpenPicker}
        style={styles.FilterSex}
      >
        <Text
          style={styles.text_filter}
        >
          {this.state.selectedSex}
        </Text>
        <Picker
          mode='dialog'
          ref={this.ref}
          selectedValue={this.state.selectedSex}
          onValueChange={(selectedSex, itemIndex) =>
            this.setState({
              selectedSex: selectedSex
            })
          }
          style={styles.dropdown}
        >
          <Picker.Item label="M" value="M" />
          <Picker.Item label="F" value="F" />
          <Picker.Item label="All" value="All" />
        </Picker>
      </TouchableOpacity>
    );
  }
}

export default FilterSex;
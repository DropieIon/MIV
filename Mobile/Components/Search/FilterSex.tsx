import React, {Component} from 'react';
import { 
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
  LayoutAnimation
} from 'react-native';
import {Picker} from '@react-native-picker/picker';


const styles = StyleSheet.create({
    FilterSex: {
      height: "100%",
      width: "20%",
      left: "80%",
      position: "absolute",
      backgroundColor: "orange",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
    },
    dropdown: {
        position: "absolute",
        // backgroundColor: "black",
        // top: -5,
        left: 0,
        right: 0,
        bottom: 0,
        // width: "100%",
        // alignContent: 'center',
        textAlign: 'center',
        // zIndex: 1
    }
  });

class FilterSex extends Component {
    state = {
        selectedSex: 'B'
    };
    componentDidMount(): void {
    }
    render(): React.ReactNode {
        return (
            <View
              style={styles.FilterSex}
            >
                <Picker
                    mode='dialog'
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
                    <Picker.Item label="B" value="B" />
                </Picker>

            </View>
        );
    }
}

export default FilterSex;
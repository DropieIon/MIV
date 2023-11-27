import React, {Component} from 'react';
import { 
  View,
  StyleSheet,
  TextInput
} from 'react-native';

const styles = StyleSheet.create({
    FilterAge: {
      height: "100%",
      width: "20%",
      left: "60%",
      position: "absolute",
      // backgroundColor: "orange",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
    }
  });

class FilterAge extends Component {
    state = {
        search_for: "Search patient...",
    };
    handlePress() {
      console.log("Merge");
        
    }
    componentDidMount(): void {
    }
    render(): React.ReactNode {
        return (
            <View
              style={styles.FilterAge}
            >
            <TextInput
            placeholder='Age'
            keyboardType='numeric'
            ></TextInput>

            </View>
        );
    }
}

export default FilterAge;
import React, {Component} from 'react';
import { 
  View,
  StyleSheet,
  TextInput
} from 'react-native';

const styles = StyleSheet.create({
    searchBox: {
      height: "100%",
      width: "60%",
      position: "absolute",
      // backgroundColor: "yellow",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
    },
    textInput: {
      flex:1
    }
  });

class SearchBar extends Component {
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
              style={styles.searchBox}
            >
            <TextInput
              style={styles.textInput}
              placeholder={this.state.search_for}
            ></TextInput>

            </View>
        );
    }
}

export default SearchBar;
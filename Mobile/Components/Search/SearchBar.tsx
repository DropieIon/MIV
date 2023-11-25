import React, {Component} from 'react';
import { 
  View,
  StyleSheet,
  TextInput
} from 'react-native';

const styles = StyleSheet.create({
    searchBox: {
      height: "50%",
      width: "60%",
      position: "relative",
      backgroundColor: "yellow",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
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
            <TextInput>Test</TextInput>

            </View>
        );
    }
}

export default SearchBar;
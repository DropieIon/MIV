import React, {Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import SearchBar from '../Search/SearchBar';
import FilterAge from '../Search/FilterAge';
import FilterSex from '../Search/FilterSex';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
      marginBottom: 10,
    },
  });

class DefaultViewDoc extends Component {
    state = {
        loading: true,
        studies_list: []
    };
    handlePress() {
      console.log("Merge");
        
    }
    componentDidMount(): void {
    }
    render(): React.ReactNode {
        return (
            <View
              style={{
                // flexDirection: 'row',
                flex:1,
                width: "100%",
                // backgroundColor: "red"
            }}
            >
              <View style={{
                flex: 4,
                width:"100%",
                backgroundColor: "red"
              }}>
              </View>
              <View style={{
                flex: 32.4,
                width:"100%",
                backgroundColor: "blue",
              }}>
                {/* Search, filter and patients View */}
                <SearchBar/>
                <FilterAge/>
                <FilterSex/>
              </View>

            </View>
        );
    }
}

export default DefaultViewDoc;
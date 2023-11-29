import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import SearchBar from '../Search/SearchBar';
import FilterAge from '../Search/FilterAge';
import FilterSex from '../Search/FilterSex';
import List from '../List/List';
import AccountInfo from '../Settings/AccountInfo';

const styles = StyleSheet.create({
  view: {
    flex:1,
    width: "100%",
  },
  view_account: {
    flex: 4.5,
    width: "100%",
    // backgroundColor: "red"
  },
  view_search: {
    flex: 2.8,
    width: "100%",
    // backgroundColor: "blue",
  },
  view_list: {
    flex: 30,
    width: "100%",
    // backgroundColor: "green"
  }
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
            style={styles.view}
          >
              <View
                style={styles.view_search}
              >
                {/* Search, filter and patients View */}
                <SearchBar/>
                <FilterAge/>
                <FilterSex/>
              </View>
              <View
                style={styles.view_list}
              >
                {/*/ Patients / Studies list */}
                <List
                  items={["test", "test1", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a","a", "a", "a", "b"]}
                // items={[]}
                ></List>
              </View>

            </View>
        );
    }
}

export default DefaultViewDoc;
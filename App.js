import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ListView, Keyboard, AsyncStorage, ActivityIndicator } from "react-native";
import Header from "./header";
import Footer from "./footer";
import Row from "./row";

const filterItems = (filter, items) =>
  items.filter(item => {
    if (filter === "ALL") {
      return true;
    }

    if (filter === "COMPLETED") {
      return item.complete;
    }

    if (filter === "ACTIVE") {
      return !item.complete;
    }
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    ...Platform.select({
      ios: { paddingTop: 30 }
    })
  },
  content: {
    flex: 1
  },
  list: {
    backgroundColor: "#fff"
  },
  separator: {
    borderWidth: 1,
    borderColor: "#f5f5f5"
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: true,
      value: "",
      filter: "ALL",
      items: [],
      allComplete: false,
      dataSource: ds.cloneWithRows([])
    };
  }
  componentWillMount() {
    AsyncStorage.getItem("items").then(json => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, { loading: false });
      } catch (e) {
        this.setState({
          loading: false
        });
      }
    });
  }
  setSource = (items, itemsDatasource, otherState = {}) => {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    });
    AsyncStorage.setItem("items", JSON.stringify(items));
  };
  handleAddItem = () => {
    if (!this.state.value) {
      return null;
    }

    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ];

    this.setSource(newItems, filterItems(this.state.filter, newItems), { value: "" });
  };
  handleChange = value => {
    this.setState({ value });
  };
  handleToggleAllComplete = () => {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map(item => ({
      ...item,
      complete
    }));

    this.setSource(newItems, filterItems(this.state.filter, newItems), { allComplete: complete });
  };
  handleToggleComplete = (key, complete) => {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) {
        return item;
      }

      return {
        ...item,
        complete
      };
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };
  handleRemoveItem = key => {
    console.log(this.state.items, key);
    const newItems = this.state.items.filter(item => item.key !== key);
    console.log(newItems);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };
  handleFilter = filter => {
    this.setSource(this.state.items, filterItems(filter, this.state.items), { filter });
  };
  handleClearComplete = () => {
    const newItems = filterItems("ACTIVE", this.state.items);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };
  handleUpdateText = (key, text) => {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) {
        return item;
      }
      return {
        ...item,
        text
      };
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };
  handleToggleEditing = (key, editing) => {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) {
        return item;
      }
      return {
        ...item,
        editing
      };
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };
  render() {
    const { value, dataSource, filter, loading } = this.state;
    return (
      <View style={styles.container}>
        <Header
          value={value}
          onAddItem={this.handleAddItem}
          onChange={this.handleChange}
          onToggleAllComplete={this.handleToggleAllComplete}
        />
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({ key, ...val }) => (
              <Row
                key={key}
                onComplete={complete => this.handleToggleComplete(key, complete)}
                onRemove={this.handleRemoveItem}
                itemKey={key}
                onUpdate={text => this.handleUpdateText(key, text)}
                onToggleEdit={editing => this.handleToggleEditing(key, editing)}
                {...val}
              />
            )}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
        </View>
        <Footer
          filter={filter}
          onFilter={this.handleFilter}
          onClearComplete={this.handleClearComplete}
          count={filterItems("ACTIVE", this.state.items).length}
          filter={filter}
          onFilter={this.handleFilter}
          onClearComplete={this.handleClearComplete}
          count={filterItems("ACTIVE", this.state.items).length}
        />
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator animating size="large" />
          </View>
        )}
      </View>
    );
  }
}

export default App;

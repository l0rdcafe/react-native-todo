import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput, Animated } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  textWrap: {
    flex: 1,
    marginHorizontal: 10
  },
  text: {
    fontSize: 24,
    color: "#4d4d4d"
  },
  complete: {
    textDecorationLine: "line-through",
    opacity: 0.7
  },
  destroy: {
    fontSize: 20,
    color: "#cc9a9a"
  },
  input: {
    height: 100,
    flex: 1,
    fontSize: 24,
    padding: 0,
    color: "#4d4d4d"
  },
  done: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#7be290",
    padding: 7
  },
  doneText: {
    color: "#4d4d4d",
    fontSize: 20
  }
});

class Row extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0)
    };
  }
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500
    }).start();
  }
  render() {
    const { complete, onRemove, onComplete, text, itemKey, onUpdate, onToggleEdit, editing } = this.props;
    const textComponent = (
      <TouchableOpacity style={styles.textWrap} onLongPress={() => onToggleEdit(true)}>
        <Text style={[styles.text, complete && styles.complete]}>{text}</Text>
      </TouchableOpacity>
    );
    const removeBtn = (
      <TouchableOpacity onPress={() => onRemove(itemKey)}>
        <Text style={styles.destroy}>X</Text>
      </TouchableOpacity>
    );
    const editingComponent = (
      <View style={styles.textWrap}>
        <TextInput onChangeText={onUpdate} autoFocus value={text} style={styles.input} multiline />
      </View>
    );

    const doneBtn = (
      <TouchableOpacity onPress={() => onToggleEdit(false)} style={styles.done}>
        <Text style={styles.doneText}>Save</Text>
      </TouchableOpacity>
    );
    return (
      <Animated.View style={[styles.container, { opacity: this.state.opacity }]}>
        <Switch value={complete} onValueChange={onComplete} />
        {editing ? editingComponent : textComponent}
        {editing ? doneBtn : removeBtn}
      </Animated.View>
    );
  }
}

export default Row;

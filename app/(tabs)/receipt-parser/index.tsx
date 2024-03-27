import { useState } from "react";
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Parser() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Paste text from a receipt</Text>
        <TextInput
          multiline
          numberOfLines={4}
          onEndEditing={(e) => setText(e.nativeEvent.text)}
          placeholder="Enter text"
          returnKeyType="done"
          style={styles.text}
        />
        <Button title="Parse" onPress={() => setOutput(text)} />
        <Text style={styles.output}>{output}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  },
  text: {},
  output: {},
});

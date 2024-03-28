import { useState } from "react";
import {
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Parser() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const parseHEBReceipt = (text: string) => {
    // RegExp to match 1-2 digits followed by whitespace followed by any characters except "Ea."
    const regex = /(^\d{1,2})\s+((?!Ea\.).*)/gm;
    const matches = [...text.matchAll(regex)];

    // Maps the matches to an array to print name
    const items = matches
      .map((item, index) => {
        const [, , name] = item;
        return `${index + 1}) ${name}`;
      })
      .join("\n");
    return items;
  };

  return (
    <ScrollView>
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
          <Button
            title="Parse"
            onPress={() => setOutput(parseHEBReceipt(text))}
          />
          <Text style={styles.output}>{output}</Text>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
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

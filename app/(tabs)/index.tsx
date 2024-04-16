import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function HomePage() {
  const handlePress = () => {
    // Navigate to the Scanner page
    router.navigate("./scan-receipt");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pocket Chef!</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Scan to Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#90d4cc",
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    width: "80%",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#006D77",
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#EDF6F9",
    fontSize: 20,
    fontWeight: "bold",
  },
});

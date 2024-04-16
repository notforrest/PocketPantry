import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { Theme, useTheme } from "../../utils/ThemeProvider";

export default function HomePage() {
  const styles = getStyles(useTheme());

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

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: 40,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 20,
      width: "80%",
    },
    button: {
      backgroundColor: theme.secondary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    buttonText: {
      color: theme.white,
      fontSize: 20,
      fontWeight: "bold",
    },
  });

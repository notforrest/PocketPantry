import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-elements";
import { Theme, useTheme } from "../../utils/ThemeProvider";

export default function HomePage() {
  const styles = getStyles(useTheme());
  const defaultProfile = "../../assets/EmptyProfile.jpg";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Image source={require(defaultProfile)} style={styles.profilePicture} />
      <Text style={styles.profileHeader}>Username</Text>
      <View style={styles.profileBody}>
        <Text>TEST TEST TEST TEST</Text>
      </View>
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
      ...theme.button,
    },
    buttonText: {
      color: theme.white,
      fontSize: 20,
      fontWeight: "bold",
    },
    profilePicture: {
      width: 130,
      height: 130,
      borderTopLeftRadius: 150,
      borderTopRightRadius: 150,
      borderBottomLeftRadius: 150,
      borderBottomRightRadius: 150,
      marginTop: 20,
      marginBottom: 20,
    },
    profileHeader: {
      fontSize: 30,
    },
    profileText: {
      fontSize: 20,
    },
    profileBody: {
      alignItems: "flex-end",
    },
  });

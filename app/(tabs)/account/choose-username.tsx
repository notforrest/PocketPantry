import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ERROR_MESSAGES } from "../../../utils/ErrorMessages";

export default function ChooseUsername() {
  const styles = getStyles(useTheme());
  const { userId, email, password } = useLocalSearchParams();

  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a username</Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={setUsername}
        placeholder="pantryman"
        placeholderTextColor={"gray"}
        style={styles.input}
        value={username}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity
        disabled={!username}
        onPress={() =>
          handleSubmitUsername(
            userId,
            username,
            email,
            password,
            setErrorMessage,
          )
        }
        style={styles.button}
      >
        <Text style={username ? styles.buttonText : styles.buttonDisabled}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const handleSubmitUsername = async (
  userId: string | string[],
  username: string,
  email: string | string[],
  password: string | string[],
  setErrorMessage: (message: string) => void,
) => {
  try {
    if (!isValidUsername(username)) {
      setErrorMessage(ERROR_MESSAGES[90000]);
      return;
    }

    router.push({
      pathname: "/account/choose-full-name",
      params: {
        userId: userId,
        username: username,
        email: email,
        password: password,
      },
    });
  } catch (error) {
    const typedError = error as { code: number };
    setErrorMessage(ERROR_MESSAGES[typedError.code] || "Error saving");
  }
};

// Validate username with regex pattern
const isValidUsername = (username: string) => {
  const regex = /^(?!_)\w{3,15}$/;
  return regex.test(username);
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      padding: "10%",
    },
    title: {
      fontSize: 48,
      fontWeight: "bold",
      marginBottom: 24,
      marginTop: "30%",
    },
    input: {
      fontSize: 30,
    },
    button: {
      alignItems: "center",
      borderRadius: 10,
      padding: 10,
    },
    buttonDisabled: {
      fontWeight: "bold",
      color: theme.darkgray,
      fontSize: 24,
    },
    buttonText: {
      fontWeight: "bold",
      color: theme.secondary,
      fontSize: 24,
    },
    errorText: {
      color: theme.error,
      fontSize: 16,
      marginTop: "5%",
      minHeight: "15%",
    },
  });

import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ERROR_MESSAGES } from "../../../utils/ErrorMessages";

export default function ChooseFullName() {
  const styles = getStyles(useTheme());
  const { userId, username, email, password } = useLocalSearchParams();

  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your full name</Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={setFullName}
        placeholder="Pantry Panther"
        placeholderTextColor={"gray"}
        style={styles.input}
        value={fullName}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity
        disabled={!fullName}
        onPress={() =>
          handleSubmitFullName(
            userId,
            username,
            fullName,
            email,
            password,
            setErrorMessage,
          )
        }
        style={styles.button}
      >
        <Text style={fullName ? styles.buttonText : styles.buttonDisabled}>
          Finish
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const handleSubmitFullName = async (
  userId: string | string[],
  username: string | string[],
  fullName: string,
  email: string | string[],
  password: string | string[],
  setErrorMessage: (message: string) => void,
) => {
  try {
    if (!isValidName(fullName)) {
      setErrorMessage(ERROR_MESSAGES[90001]);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
    });

    const { error } = await supabase.from("profiles").upsert([
      {
        id: session?.user.id,
        updated_at: new Date(),
        username: username,
        full_name: fullName,
      },
    ]);

    if (error) {
      throw error;
    } else {
      router.push({
        pathname: "/account/profile",
        params: { userId: userId },
      });
    }
  } catch (error) {
    const typedError = error as { code: number };
    setErrorMessage(ERROR_MESSAGES[typedError.code] || "Error saving");
  }
};

// Validate full name with regex pattern
const isValidName = (username: string) => {
  const regex = /^(?!\s|-)[a-zA-Z\s-]{3,19}[a-zA-Z]$/;
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

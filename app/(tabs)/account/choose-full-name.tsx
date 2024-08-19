import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ERROR_MESSAGES } from "../../../utils/ErrorMessages";

export default function ChooseFullName() {
  const styles = getStyles(useTheme());
  const { userId } = useLocalSearchParams();

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
        onPress={() => handleSubmitFullName(userId, fullName, setErrorMessage)}
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
  fullName: string,
  setErrorMessage: (message: string) => void,
) => {
  try {
    if (!isValidName(fullName)) {
      setErrorMessage(ERROR_MESSAGES[90001]);
      return;
    }

    const { error } = await supabase.from("profiles").upsert([
      {
        id: userId,
        updated_at: new Date(),
        full_name: fullName,
      },
    ]);
    if (error) {
      throw error;
    } else {
      router.replace("/account/profile");
      router.setParams({ userId: userId });
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

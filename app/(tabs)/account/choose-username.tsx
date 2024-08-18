import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ChooseUsername() {
  const styles = getStyles(useTheme());
  const [username, setUsername] = useState("");
  const { userId } = useLocalSearchParams();

  const handleSubmitUsername = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert([
        {
          id: userId,
          updated_at: new Date(),
          username: username,
        },
      ]);
      if (error) {
        throw error;
      } else {
        router.push("/account/choose-full-name");
        router.setParams({ userId: userId });
      }
    } catch (error) {
      console.error("Error saving: ", error);
    }
  };

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
      <TouchableOpacity
        disabled={!username}
        onPress={handleSubmitUsername}
        style={styles.button}
      >
        <Text style={username ? styles.buttonText : styles.buttonDisabled}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}

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
      marginTop: "20%",
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
  });

import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";
import { SymbolView } from "expo-symbols";
import { Theme, useTheme } from "../utils/ThemeProvider";

export default function Auth() {
  const styles = getStyles(useTheme());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <View style={styles.textInput}>
        <SymbolView
          name="envelope"
          resizeMode="scaleAspectFit"
          tintColor={"black"}
        />
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          style={{ width: "80%" }}
        />
      </View>
      <Text>Password</Text>
      <View style={styles.textInput}>
        <SymbolView
          name="lock"
          resizeMode="scaleAspectFit"
          tintColor={"black"}
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          style={{ width: "80%" }}
        />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity disabled={loading} onPress={() => signInWithEmail()}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={loading} onPress={() => signUpWithEmail()}>
          <Text>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 30,
      width: "90%",
      gap: 10,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: theme.white,
      borderRadius: 10,
    },
    buttons: {
      alignItems: "center",
      gap: 10,
      marginVertical: 10,
    },
    textInput: {
      alignItems: "center",
      backgroundColor: "lightgray",
      borderRadius: 5,
      flexDirection: "row",
      gap: 10,
      marginVertical: 10,
      padding: 10,
    },
  });

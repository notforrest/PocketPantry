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
import { router } from "expo-router";

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

    // Create a username
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace("/account/choose-username");
      router.setParams({
        userId: data.session?.user.id,
        email: email,
        password: password,
      });
    }

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
          autoCapitalize={"none"}
          onChangeText={(text) => setEmail(text)}
          placeholder="email@address.com"
          style={{ flex: 1 }}
          value={email}
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
          autoCapitalize={"none"}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          secureTextEntry={true}
          style={{ flex: 1 }}
          value={password}
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
      marginTop: 10,
      marginBottom: 25,
      padding: 10,
      minWidth: "80%",
    },
  });

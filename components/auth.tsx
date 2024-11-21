import React, { useEffect, useState } from "react";
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
import { router, useNavigation } from "expo-router";

export default function Auth() {
  const styles = getStyles(useTheme());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const navigation = useNavigation();

  // Reset states on load
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setShowPasswordError(false);
      setEmail("");
      setPassword("");
    });
    return unsubscribe;
  }, [navigation]);

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
    } else if (password.length < 6) {
      setShowPasswordError(true);
    } else {
      router.replace({
        pathname: "/account/choose-username",
        params: {
          userId: data.session?.user.id,
          email: email,
          password: password,
        },
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
      {showPasswordError && (
        <Text style={styles.errorMessage}>
          Invalid password{"\n"}
          (Must be 6 or more characters)
        </Text>
      )}
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
    errorMessage: {
      textAlign: "center",
      color: theme.error,
      fontSize: 14,
      marginBottom: "5%",
    },
  });

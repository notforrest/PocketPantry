import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";

type LocalSearchParams = {
  fetchedId: string;
  fetchedUser: string;
  fetchedName: string;
  fetchedEmail: string;
};

export default function HomePage() {
  const styles = getStyles(useTheme());
  const { fetchedId, fetchedUser, fetchedName, fetchedEmail } =
    useLocalSearchParams<LocalSearchParams>();

  const [saveSucceeded, setSaveSucceeded] = useState(false);

  const [currentUserId, setCurrentUserId] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [name, setName] = useState("");
  const [isNameFocused, setNameFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailFocused, setEmailFocused] = useState(false);

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert([
        {
          id: currentUserId,
          updated_at: new Date(),
          username: username,
          full_name: name,
          email: email,
        },
      ]);
      if (error) {
        throw error;
      } else {
        setSaveSucceeded(true);
        setIsUsernameFocused(false);
        setNameFocused(false);
        setEmailFocused(false);
        router.back();
        router.setParams({
          newUser: username,
          newName: name,
        });
      }
    } catch (error) {
      console.error("Error saving: ", error);
    }
  };

  useEffect(() => {
    setCurrentUserId(fetchedId);
    setUsername(fetchedUser);
    setName(fetchedName);
    setEmail(fetchedEmail);
  }, [fetchedUser, fetchedName, fetchedEmail, fetchedId]);

  // Reset saveSucceeded when the user changes their profile
  useEffect(() => {
    setSaveSucceeded(false);
  }, [username, name, email]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.page}>
      <View style={styles.profileContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Username</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setUsername}
            onEndEditing={() => setIsUsernameFocused(false)}
            onFocus={() => setIsUsernameFocused(true)}
            style={
              isUsernameFocused
                ? styles.profileTextSelected
                : styles.profileText
            }
            textContentType="name"
            value={username}
          />
        </View>
        <View style={styles.fieldContainerBorders}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setName}
            onEndEditing={() => setNameFocused(false)}
            onFocus={() => setNameFocused(true)}
            style={
              isNameFocused ? styles.profileTextSelected : styles.profileText
            }
            value={name}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            autoCapitalize="none"
            inputMode="email"
            onChangeText={setEmail}
            onEndEditing={() => setEmailFocused(false)}
            onFocus={() => setEmailFocused(true)}
            style={
              isEmailFocused ? styles.profileTextSelected : styles.profileText
            }
            textContentType="emailAddress"
            value={email}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={async () => {
              router.replace("/account");
              await supabase.auth.signOut();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={saveSucceeded}
            onPress={handleSave}
            style={saveSucceeded ? styles.buttonSaved : styles.button}
          >
            <Text style={styles.buttonText}>
              {saveSucceeded ? "Saved!" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      alignItems: "center",
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    button: {
      ...theme.button,
    },
    buttonSaved: {
      ...theme.button,
      backgroundColor: theme.darkgray,
    },
    buttonText: {
      color: theme.white,
      fontSize: 16,
    },
    profileContainer: {
      backgroundColor: theme.white,
      borderColor: theme.gray,
      borderRadius: 15,
      borderWidth: 1,
      gap: 15,
      padding: 20,
      width: "80%",
    },
    fieldContainer: {
      gap: 10,
    },
    fieldContainerBorders: {
      borderBottomColor: theme.gray,
      borderBottomWidth: 1,
      borderTopColor: theme.gray,
      borderTopWidth: 1,
      paddingTop: 20,
      paddingBottom: 20,
      gap: 10,
    },
    fieldLabel: {
      fontSize: 20,
      fontWeight: "500",
    },
    profileText: {
      color: theme.gray,
      fontSize: 18,
    },
    profileTextSelected: {
      color: theme.black,
      fontSize: 18,
    },
  });

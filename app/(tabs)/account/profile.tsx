import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";
import { SymbolView } from "expo-symbols";

export default function HomePage() {
  const styles = getStyles(useTheme());

  const [currentUserId, setCurrentUserId] = useState("");
  const [saveSucceeded, setSaveSucceeded] = useState(false);

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
      }
    } catch (error) {
      console.error("Error saving: ", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id);

      if (error) {
        console.error(error);
      } else {
        if (user) setCurrentUserId(user.id);

        if (data?.length) {
          setUsername(data[0].username);
          setName(data[0].full_name);
          setEmail(data[0].email);
        }
      }
    };
    fetchProfile();
  }, []);

  // Reset saveSucceeded when the user changes their profile
  useEffect(() => {
    setSaveSucceeded(false);
  }, [username, name, email]);

  return (
    <View style={styles.page}>
      <SymbolView name="person.crop.circle.fill" size={150} tintColor="black" />
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Username</Text>
        <View style={styles.profileField}>
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
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Full Name</Text>
        <View style={styles.profileField}>
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
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Email</Text>
        <View style={styles.profileField}>
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
      width: "70%",
    },
    button: {
      ...theme.button,
      marginTop: 20,
    },
    buttonSaved: {
      ...theme.button,
      backgroundColor: theme.darkgray,
      marginTop: 20,
    },
    buttonText: {
      color: theme.white,
    },
    profileContainer: {
      gap: 10,
      margin: 10,
      width: "80%",
    },
    profileLabel: {
      fontSize: 20,
      marginLeft: 10,
    },
    profileField: {
      alignItems: "center",
      backgroundColor: theme.white,
      borderRadius: 15,
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
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

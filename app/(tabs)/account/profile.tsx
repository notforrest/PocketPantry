import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";
import { SymbolView } from "expo-symbols";

export default function HomePage() {
  const styles = getStyles(useTheme());

  const [currentUserId, setCurrentUserId] = useState("");

  const [username, setUsername] = useState("JohnDoe");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [name, setName] = useState("");
  const [isNameFocused, setNameFocused] = useState(false);
  const [email, setEmail] = useState("johndoe@email.com");
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
          setName(data[0].name);
          setEmail(data[0].email);
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <View style={styles.page}>
      <SymbolView name="person.crop.circle.fill" size={150} tintColor="black" />
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Username</Text>
        <View style={styles.profileField}>
          <TextInput
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
            style={
              isNameFocused ? styles.profileTextSelected : styles.profileText
            }
            value={name}
            onChangeText={setName}
            onEndEditing={() => setNameFocused(false)}
            onFocus={() => setNameFocused(true)}
          />
        </View>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Email</Text>
        <View style={styles.profileField}>
          <TextInput
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
        <Pressable
          onPress={async () => {
            router.replace("/account");
            await supabase.auth.signOut();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
        <Pressable onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
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

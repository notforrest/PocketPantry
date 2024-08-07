import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";
import { SymbolView } from "expo-symbols";

export default function HomePage() {
  const styles = getStyles(useTheme());

  const [name, setName] = useState("John Doe");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [email, setEmail] = useState("johndoe@email.com");
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [birthday, setBirthday] = useState("01/01/2000");
  const [isBirthdayFocused, setBirthdayFocused] = useState(false);

  return (
    <View style={styles.page}>
      <SymbolView name="person.crop.circle.fill" size={150} tintColor="black" />
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Name</Text>
        <View style={styles.profileField}>
          <SymbolView name="person.crop.circle.fill" tintColor="black" />
          <TextInput
            style={
              isNameFocused ? styles.profileTextSelected : styles.profileText
            }
            value={name}
            onChangeText={setName}
            onEndEditing={() => setIsNameFocused(false)}
            onFocus={() => setIsNameFocused(true)}
          />
        </View>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Email</Text>
        <View style={styles.profileField}>
          <SymbolView
            name="envelope.fill"
            resizeMode="scaleAspectFit"
            tintColor="black"
          />
          <TextInput
            style={
              isEmailFocused ? styles.profileTextSelected : styles.profileText
            }
            value={email}
            onChangeText={setEmail}
            onEndEditing={() => setEmailFocused(false)}
            onFocus={() => setEmailFocused(true)}
          />
        </View>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Birthday</Text>
        <View style={styles.profileField}>
          <SymbolView name="calendar" tintColor="black" />
          <TextInput
            style={
              isBirthdayFocused
                ? styles.profileTextSelected
                : styles.profileText
            }
            value={birthday}
            onChangeText={setBirthday}
            onEndEditing={() => setBirthdayFocused(false)}
            onFocus={() => setBirthdayFocused(true)}
          />
        </View>
      </View>
      <Pressable
        style={styles.button}
        onPress={async () => {
          router.replace("/account");
          await supabase.auth.signOut();
        }}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
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
    button: {
      ...theme.button,
      marginTop: 20,
    },
    buttonText: {
      color: theme.white,
    },
    profileContainer: {
      width: "80%",
      gap: 10,
      margin: 10,
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
      padding: 10,
    },
    profileText: {
      fontSize: 18,
      color: theme.gray,
    },
    profileTextSelected: {
      fontSize: 18,
      color: theme.black,
    },
  });

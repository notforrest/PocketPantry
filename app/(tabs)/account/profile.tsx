import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { supabase } from "../../../utils/supabase";
import { SymbolView } from "expo-symbols";

export default function HomePage() {
  const styles = getStyles(useTheme());
  const { newUser, newName } = useLocalSearchParams<{
    newUser: string;
    newName: string;
  }>();

  const [currentUserId, setCurrentUserId] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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

  useEffect(() => {
    if (newUser) setUsername(newUser);
    if (newName) setName(newName);
  }, [newUser, newName]);

  return (
    <View style={styles.page}>
      <TouchableOpacity
        onPress={() => {
          router.push("./edit-profile");
          router.setParams({
            fetchedId: currentUserId,
            fetchedUser: username,
            fetchedName: name,
            fetchedEmail: email,
          });
        }}
        style={styles.editProfileButton}
      >
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
      <SymbolView name="person.crop.circle.fill" size={150} tintColor="black" />
      <View style={styles.profileContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.usernameText}>{`@${username}`}</Text>
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
      padding: "5%",
    },
    editProfileButton: {
      borderColor: theme.secondary,
      borderRadius: 15,
      borderWidth: 1,
      position: "absolute",
      paddingHorizontal: 10,
      paddingVertical: 5,
      right: "10%",
      top: "10%",
    },
    editProfileText: {
      color: theme.secondary,
    },
    profileContainer: {
      gap: 10,
      marginTop: 10,
    },
    nameText: {
      color: theme.black,
      fontSize: 36,
      textAlign: "center",
    },
    usernameText: {
      color: theme.black,
      fontSize: 20,
      textAlign: "center",
    },
  });

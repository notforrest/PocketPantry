import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../utils/supabase";

export default function HomePage() {
  const styles = getStyles(useTheme());
  const defaultProfile = "../../assets/EmptyProfile.jpg";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: "absolute", right: "10%", top: "9%", zIndex: 1 }}
      >
        <Ionicons name="create-outline" size={32} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>My Profile</Text>
      {/*<Image source={require(defaultProfile)} style={styles.profilePicture} />*/}
      <Ionicons name="person-circle" size={150} />
      <Text style={styles.profileHeader}>Username</Text>
      <View style={styles.profileBody}>
        <Ionicons name="person-circle" size={32} />
        <Text style={styles.profileText}> Bio...</Text>
      </View>
      <View style={styles.profileBody}>
        <Ionicons name="mail-outline" size={32} />
        <Text style={styles.profileText}> user@email.com</Text>
      </View>
      <View style={styles.profileBody}>
        <Ionicons name="call-outline" size={32} />
        <Text style={styles.profileText}> (123) 456-7890</Text>
      </View>
      <View style={styles.profileBody}>
        <Ionicons name="calendar-outline" size={32} />
        <Text style={styles.profileText}> 11/24/2001</Text>
      </View>
      <Pressable
        style={{ marginTop: 20 }}
        onPress={async () => {
          router.replace("/account");
          await supabase.auth.signOut();
        }}
      >
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 40,
      textAlign: "center",
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 20,
      width: "80%",
    },
    button: {
      ...theme.button,
    },
    buttonText: {
      color: theme.white,
      fontSize: 20,
      fontWeight: "bold",
    },
    profilePicture: {
      width: 130,
      height: 130,
      borderTopLeftRadius: 150,
      borderTopRightRadius: 150,
      borderBottomLeftRadius: 150,
      borderBottomRightRadius: 150,
      marginTop: 20,
      marginBottom: 20,
    },
    profileHeader: {
      fontSize: 30,
      marginBottom: 20,
    },
    profileText: {
      fontSize: 20,
    },
    profileBody: {
      backgroundColor: "white",
      height: 70,
      width: 350,
      padding: 20,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      justifyContent: "flex-start",
      alignItems: "stretch",
      marginTop: 20,
      flexDirection: "row",
    },
  });

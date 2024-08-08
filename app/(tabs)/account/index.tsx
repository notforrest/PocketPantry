import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { useEffect } from "react";
import { supabase } from "../../../utils/supabase";
import Auth from "../../../components/auth";

export default function Account() {
  const styles = getStyles(useTheme());

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session || event === "SIGNED_IN") {
        router.replace("/account/profile");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Auth />
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
      fontSize: 24,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 20,
    },
  });

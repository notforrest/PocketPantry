import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme, useTheme } from "../../../utils/ThemeProvider";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../../utils/supabase";
import Auth from "../../../components/auth";

export default function Account() {
  const styles = getStyles(useTheme());
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === "SIGNED_IN") {
        router.replace("/account/profile");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
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

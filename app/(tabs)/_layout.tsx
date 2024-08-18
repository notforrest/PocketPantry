import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useEffect, useState } from "react";

import { useTheme } from "../../utils/ThemeProvider";
import { supabase } from "../../utils/supabase";

export default function TabLayout() {
  const theme = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session || event === "SIGNED_IN") {
        setShowProfile(true);
      } else {
        setShowProfile(false);
      }
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.secondary,
        tabBarStyle: { backgroundColor: theme.white },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon(props) {
            return (
              <SymbolView
                name="house.fill"
                resizeMode="scaleAspectFill"
                tintColor={props.color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="scan-receipt"
        options={{
          headerShown: false,
          headerTitle: "Scan Receipt",
          title: "Scanner",
          tabBarIcon(props) {
            return (
              <SymbolView
                name="viewfinder"
                resizeMode="scaleAspectFill"
                tintColor={props.color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="manual/index"
        options={{
          headerShown: false,
          headerTitle: "Manual Input",
          title: "Manual",
          tabBarIcon(props) {
            return (
              <SymbolView
                name="pencil.and.scribble"
                resizeMode="scaleAspectFill"
                tintColor={props.color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="my-pantry/index"
        options={{
          headerShown: false,
          headerTitle: "My Pantry",
          title: "My Pantry",
          tabBarIcon(props) {
            return (
              <SymbolView
                name="basket.fill"
                resizeMode="scaleAspectFill"
                tintColor={props.color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerShown: false,
          headerTitle: "Account",
          href: showProfile ? "/account/profile" : "/account",
          title: showProfile ? "Profile" : "Login",
          tabBarIcon(props) {
            return (
              <SymbolView
                name="person.crop.circle.fill"
                resizeMode="scaleAspectFill"
                tintColor={props.color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

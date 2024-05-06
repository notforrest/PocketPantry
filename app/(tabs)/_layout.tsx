import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";

import { useTheme } from "../../utils/ThemeProvider";

export default function TabLayout() {
  const theme = useTheme();

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
        name="profile"
        options={{
          headerShown: false,
          headerTitle: "Profile",
          title: "Profile",
          tabBarIcon(props) {
            return (
              <Ionicons name="person-circle" size={24} color={props.color} />
            );
          },
        }}
      />
    </Tabs>
  );
}

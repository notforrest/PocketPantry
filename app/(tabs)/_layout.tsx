import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon(props) {
            return <Ionicons name="home" size={24} color={props.color} />;
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
            return <Ionicons name="scan" size={24} color={props.color} />;
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
            return <Ionicons name="basket" size={24} color={props.color} />;
          },
        }}
      />
    </Tabs>
  );
}

import { Foundation } from "@expo/vector-icons";
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
            return <Foundation name="home" size={24} color={props.color} />;
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
              <Foundation
                name="magnifying-glass"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

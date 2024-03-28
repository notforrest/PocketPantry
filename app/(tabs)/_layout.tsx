import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="receipt-parser/index"
        options={{
          headerTitle: "Scan Receipt",
          title: "Scanner",
        }}
      />
    </Tabs>
  );
}

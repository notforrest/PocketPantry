import { Stack } from "expo-router/stack";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="choose-username" options={{ headerShown: false }} />
      <Stack.Screen name="choose-full-name" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}

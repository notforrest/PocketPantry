import { Stack } from "expo-router/stack";

export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Camera" }} />
      <Stack.Screen name="parser" options={{ headerTitle: "Receipt Parser" }} />
    </Stack>
  );
}

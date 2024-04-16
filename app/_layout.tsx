import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import IngredientsProvider from "../utils/IngredientsProvider";
import ThemeProvider from "../utils/ThemeProvider";

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <IngredientsProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </IngredientsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

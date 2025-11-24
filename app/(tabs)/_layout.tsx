import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="freezer" options={{ headerShown: false }} />
      <Stack.Screen name="despensa" options={{ headerShown: false }} />
    </Stack>
  );
}

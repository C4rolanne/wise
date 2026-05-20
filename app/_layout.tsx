import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";

import { AppPreferencesProvider, useAppPreferences } from "@/src/shared/theme";
import { AppErrorBoundary } from "@/src/shared/ui";
import tamaguiConfig from "@/tamagui.config";

function RootStack() {
  const { colorScheme } = useAppPreferences();

  return (
    <Theme name={colorScheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="inventory" options={{ headerShown: false }} />
        <Stack.Screen name="refrigerator" options={{ headerShown: false }} />
        <Stack.Screen name="freezer" options={{ headerShown: false }} />
        <Stack.Screen name="pantry" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      </Stack>
    </Theme>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initialColorScheme = colorScheme === "dark" ? "dark" : "light";

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={initialColorScheme}>
      <AppPreferencesProvider initialColorScheme={initialColorScheme}>
        <AppErrorBoundary>
          <RootStack />
        </AppErrorBoundary>
      </AppPreferencesProvider>
    </TamaguiProvider>
  );
}

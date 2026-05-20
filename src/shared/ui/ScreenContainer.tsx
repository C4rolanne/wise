import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { YStack, type YStackProps } from "tamagui";

import { useAppPreferences } from "@/src/shared/theme";

interface ScreenContainerProps extends YStackProps {
  scroll?: boolean;
}

export function ScreenContainer({ children, scroll = false, ...props }: ScreenContainerProps) {
  const { colors } = useAppPreferences();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <YStack style={{ backgroundColor: colors.background, flex: 1 }} {...props}>
        {scroll ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={{ flex: 1 }}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </YStack>
    </SafeAreaView>
  );
}

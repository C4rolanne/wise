import { Card, type CardProps } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

export function AppCard(props: CardProps) {
  const { colors } = useAppPreferences();

  return (
    <Card
      elevation="$1"
      p="$4"
      pressStyle={{ scale: 0.995 }}
      style={{
        backgroundColor: colors.surface,
        borderRadius: appRadii.lg,
        borderWidth: 0,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      }}
      {...props}
    />
  );
}

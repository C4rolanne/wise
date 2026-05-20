import { Text, YStack } from "tamagui";

import { useAppPreferences } from "@/src/shared/theme";

interface SectionTitleProps {
  title: string;
  description?: string;
}

export function SectionTitle({ title, description }: SectionTitleProps) {
  const { colors } = useAppPreferences();

  return (
    <YStack gap="$1">
      <Text fontSize="$5" fontWeight="900" style={{ color: colors.text }}>
        {title}
      </Text>
      {description ? (
        <Text fontSize="$3" style={{ color: colors.textMuted }}>
          {description}
        </Text>
      ) : null}
    </YStack>
  );
}

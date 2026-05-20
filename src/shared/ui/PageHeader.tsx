import type { ReactNode } from "react";
import { H1, Text, XStack, YStack } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { colors } = useAppPreferences();

  return (
    <XStack
      pb="$5"
      px="$4"
      pt="$7"
      style={{
        alignItems: "center",
        backgroundColor: colors.primarySoft,
        borderBottomLeftRadius: appRadii.xl,
        borderBottomRightRadius: appRadii.xl,
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <YStack gap="$1" pr="$3" style={{ flex: 1 }}>
        <H1 fontSize="$8" fontWeight="900" lineHeight="$8" style={{ color: colors.text }}>
          {title}
        </H1>
        {subtitle ? (
          <Text fontSize="$3" lineHeight="$4" style={{ color: colors.textMuted }}>
            {subtitle}
          </Text>
        ) : null}
      </YStack>
      {action}
    </XStack>
  );
}

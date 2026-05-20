import type { ReactNode } from "react";
import { Text, YStack } from "tamagui";

import { useAppPreferences } from "@/src/shared/theme";

import { AppButton } from "./AppButton";
import { SkeletonState } from "./Skeleton";

interface StateViewProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
  icon?: ReactNode;
}

export function StateView({
  title,
  description,
  actionLabel,
  onAction,
  loading = false,
  icon,
}: StateViewProps) {
  const { colors } = useAppPreferences();

  if (loading) {
    return <SkeletonState />;
  }

  return (
    <YStack gap="$3" p="$6" style={{ alignItems: "center", justifyContent: "center" }}>
      {icon}
      <Text fontSize="$5" fontWeight="900" style={{ color: colors.text, textAlign: "center" }}>
        {title}
      </Text>
      {description ? (
        <Text fontSize="$3" lineHeight="$4" style={{ color: colors.textMuted, maxWidth: 420, textAlign: "center" }}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? <AppButton onPress={onAction}>{actionLabel}</AppButton> : null}
    </YStack>
  );
}

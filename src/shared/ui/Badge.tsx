import { Text, XStack, type XStackProps } from "tamagui";

import { useAppPreferences } from "@/src/shared/theme";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends XStackProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = "neutral", ...props }: BadgeProps) {
  const { colors } = useAppPreferences();
  const badgeStyles: Record<BadgeTone, { backgroundColor: string; color: string }> = {
    neutral: { backgroundColor: colors.surfaceAlt, color: colors.textMuted },
    success: { backgroundColor: colors.successSoft, color: colors.success },
    warning: { backgroundColor: colors.warningSoft, color: colors.warning },
    danger: { backgroundColor: colors.dangerSoft, color: colors.danger },
    info: { backgroundColor: colors.infoSoft, color: colors.info },
  };
  const styles = badgeStyles[tone];

  return (
    <XStack
      px="$3"
      py="$1.5"
      style={{
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: styles.backgroundColor,
        borderRadius: 999,
      }}
      {...props}
    >
      <Text fontSize="$2" fontWeight="800" style={{ color: styles.color }}>
        {label}
      </Text>
    </XStack>
  );
}

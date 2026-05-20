import type { ReactNode } from "react";
import { Button, Spinner, Text, type ButtonProps, XStack } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

type AppButtonTone = "primary" | "secondary" | "danger" | "ghost";

interface AppButtonProps extends ButtonProps {
  tone?: AppButtonTone;
  loading?: boolean;
  icon?: ButtonProps["icon"];
  leftIcon?: ReactNode;
}

export function AppButton({
  tone = "primary",
  loading = false,
  disabled,
  circular,
  icon,
  leftIcon,
  children,
  style,
  ...props
}: AppButtonProps) {
  const { colors } = useAppPreferences();
  const effectiveTone = props.chromeless ? "ghost" : tone;
  const toneStyles: Record<AppButtonTone, { backgroundColor: string; color: string }> = {
    primary: {
      backgroundColor: colors.primary,
      color: colors.primaryText,
    },
    secondary: {
      backgroundColor: colors.surfaceAlt,
      color: colors.text,
    },
    danger: {
      backgroundColor: colors.danger,
      color: colors.primaryText,
    },
    ghost: {
      backgroundColor: "transparent",
      color: colors.primary,
    },
  };
  const styles = toneStyles[effectiveTone];

  return (
    <Button
      circular={circular}
      disabled={disabled || loading}
      hoverStyle={{ opacity: disabled || loading ? 0.65 : 0.94, scale: disabled || loading ? 1 : 1.02 }}
      pressStyle={{ opacity: 0.92, scale: 0.96 }}
      style={[
        {
          alignItems: "center",
          backgroundColor: styles.backgroundColor,
          borderRadius: appRadii.pill,
          borderWidth: 0,
          cursor: disabled || loading ? "default" : "pointer",
          justifyContent: "center",
          minWidth: circular ? 46 : undefined,
          minHeight: 46,
          opacity: disabled || loading ? 0.65 : 1,
          paddingHorizontal: circular ? 0 : 16,
          shadowColor: effectiveTone === "ghost" ? "transparent" : colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: effectiveTone === "ghost" ? 0 : 0.08,
          shadowRadius: 16,
        },
        style,
      ]}
      {...props}
    >
      <XStack gap="$2" style={{ alignItems: "center", justifyContent: "center", minWidth: 0 }}>
        {loading ? <Spinner color={styles.color} size="small" /> : leftIcon ?? (icon as ReactNode)}
        {typeof children === "string" ? (
          <Text numberOfLines={1} style={{ color: styles.color, flexShrink: 1, fontWeight: "800" }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </XStack>
    </Button>
  );
}

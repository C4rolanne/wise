import { Input, Label, Text, YStack, type InputProps } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

interface FormFieldProps extends InputProps {
  label: string;
  error?: string | null;
}

export function FormField({ label, error, ...props }: FormFieldProps) {
  const { colors } = useAppPreferences();

  return (
    <YStack gap="$2">
      <Label fontSize="$3" fontWeight="800" lineHeight="$3" style={{ color: colors.text }}>
        {label}
      </Label>
      <Input
        px="$3"
        style={{
          backgroundColor: error ? colors.dangerSoft : colors.surfaceAlt,
          borderRadius: appRadii.md,
          borderWidth: 0,
          color: colors.text,
          minHeight: 46,
        }}
        {...props}
      />
      {error ? (
        <Text fontSize="$2" style={{ color: colors.danger }}>
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}

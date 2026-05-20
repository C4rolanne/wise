import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Label, Text, XStack, YStack } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

interface PickerOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface PickerFieldProps<TValue extends string> {
  label: string;
  value: TValue;
  options: PickerOption<TValue>[];
  onChange: (value: TValue) => void;
  error?: string | null;
}

export function PickerField<TValue extends string>({
  label,
  value,
  options,
  onChange,
  error,
}: PickerFieldProps<TValue>) {
  const { colors } = useAppPreferences();
  const { width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const dropdownWidth = Math.min(width - 32, 420);

  return (
    <YStack gap="$2">
      <Label fontSize="$3" fontWeight="800" lineHeight="$3" style={{ color: colors.text }}>
        {label}
      </Label>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: error ? colors.dangerSoft : colors.surfaceAlt,
          borderColor: error ? colors.danger : colors.surfaceStrong,
          borderRadius: appRadii.lg,
          borderWidth: 1,
          cursor: "pointer",
          minHeight: 46,
          overflow: "hidden",
          paddingHorizontal: 14,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.06,
          shadowRadius: 14,
        }}
      >
        <XStack style={{ alignItems: "center", minHeight: 46 }}>
          <Text numberOfLines={1} fontSize="$3" fontWeight="800" style={{ color: colors.text, flex: 1 }}>
            {selectedOption?.label ?? label}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            color={colors.textMuted}
            size={22}
          />
        </XStack>
      </Pressable>

      <Modal transparent animationType="fade" visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <YStack style={{ flex: 1, justifyContent: "center" }}>
          <Pressable
            style={{
              backgroundColor: colors.overlay,
              bottom: 0,
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            }}
            onPress={() => setIsOpen(false)}
          />
          <YStack
            p="$2"
            style={{
              alignSelf: "center",
              backgroundColor: colors.surface,
              borderColor: colors.surfaceStrong,
              borderRadius: appRadii.xl,
              borderWidth: 1,
              maxHeight: 340,
              overflow: "hidden",
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 18 },
              shadowOpacity: 0.18,
              shadowRadius: 28,
              width: dropdownWidth,
            }}
          >
            <Text fontSize="$3" fontWeight="900" px="$3" py="$2" style={{ color: colors.text }}>
              {label}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const selected = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: selected ? colors.primarySoft : pressed ? colors.surfaceAlt : "transparent",
                      borderRadius: appRadii.md,
                      cursor: "pointer",
                      marginVertical: 2,
                      opacity: pressed ? 0.84 : 1,
                    })}
                  >
                    <XStack px="$3" py="$3" style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text fontSize="$3" fontWeight={selected ? "900" : "700"} style={{ color: colors.text }}>
                        {option.label}
                      </Text>
                      {selected ? (
                        <MaterialCommunityIcons name="check" color={colors.primary} size={20} />
                      ) : null}
                    </XStack>
                  </Pressable>
                );
              })}
            </ScrollView>
          </YStack>
        </YStack>
      </Modal>
      {error ? (
        <Text fontSize="$2" style={{ color: colors.danger }}>
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}

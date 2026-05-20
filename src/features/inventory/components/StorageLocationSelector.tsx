import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, XStack, YStack } from "tamagui";

import { useTranslation } from "@/src/shared/i18n";
import { appRadii, useAppPreferences } from "@/src/shared/theme";
import type { FoodStorage } from "@/types/food";

interface StorageLocationSelectorProps {
  selectedStorage: FoodStorage;
}

const storageTabs: {
  storage: FoodStorage;
  labelKey: "storage.refrigerator" | "storage.freezer" | "storage.pantry";
  route: "/(tabs)/dashboard" | "/freezer" | "/pantry";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { storage: "refrigerator", labelKey: "storage.refrigerator", route: "/(tabs)/dashboard", icon: "fridge-outline" },
  { storage: "freezer", labelKey: "storage.freezer", route: "/freezer", icon: "snowflake" },
  { storage: "pantry", labelKey: "storage.pantry", route: "/pantry", icon: "warehouse" },
];

export function StorageLocationSelector({ selectedStorage }: StorageLocationSelectorProps) {
  const { t } = useTranslation();
  const { colors } = useAppPreferences();

  return (
    <XStack gap="$2" style={{ alignSelf: "center", maxWidth: 620, width: "100%" }}>
      {storageTabs.map((tab) => {
        const selected = selectedStorage === tab.storage;

        return (
          <YStack
            key={tab.storage}
            gap="$1"
            onPress={() => router.push(tab.route)}
            pressStyle={{ opacity: 0.82, scale: 0.98 }}
            style={{
              alignItems: "center",
              backgroundColor: selected ? colors.primary : colors.surface,
              borderRadius: appRadii.lg,
              borderWidth: 0,
              cursor: "pointer",
              flex: 1,
              justifyContent: "center",
              minHeight: 68,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: selected ? 0.14 : 0.08,
              shadowRadius: 16,
            }}
          >
            <MaterialCommunityIcons name={tab.icon} color={selected ? colors.primaryText : colors.primary} size={24} />
            <Text fontSize="$2" fontWeight="800" style={{ color: selected ? colors.primaryText : colors.text }}>
              {t(tab.labelKey)}
            </Text>
          </YStack>
        );
      })}
    </XStack>
  );
}

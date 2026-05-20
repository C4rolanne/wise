import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, XStack, YStack } from "tamagui";

import { useTranslation } from "@/src/shared/i18n";
import { useAppPreferences } from "@/src/shared/theme";
import { AppButton, AppCard, Badge } from "@/src/shared/ui";
import type { Food } from "@/types/food";
import {
  formatDate,
  getCategoryName,
  getFoodStatusLabel,
  getFoodStatusValue,
} from "@/utils/foodDisplay";

interface FoodItemCardProps {
  food: Food;
  onEdit?: (food: Food) => void;
  onDelete?: (food: Food) => void;
  compact?: boolean;
}

const getStatusTone = (food: Food) => {
  const status = getFoodStatusValue(food);
  if (status === "expired") return "danger";
  if (status === "expires_today" || status === "expiring_soon") return "warning";
  if (status === "valid" || status === "ok") return "success";
  return "neutral";
};

export function FoodItemCard({ food, onEdit, onDelete, compact = false }: FoodItemCardProps) {
  const { t } = useTranslation();
  const { colors } = useAppPreferences();

  return (
    <AppCard gap="$3">
      <YStack gap="$3">
        <XStack gap="$3" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <YStack gap="$2" style={{ flex: 1 }}>
            <Text fontSize={compact ? "$5" : "$6"} fontWeight="900" style={{ color: colors.text }}>
              {food.name}
            </Text>
            <XStack gap="$2" style={{ flexWrap: "wrap" }}>
              <Badge label={getCategoryName(food.category, t)} tone="neutral" />
              <Badge label={t(`storage.${food.storage}`)} tone="info" />
              <Badge label={getFoodStatusLabel(food, t)} tone={getStatusTone(food)} />
            </XStack>
          </YStack>
        </XStack>

        <XStack gap="$3" style={{ flexWrap: "wrap" }}>
          <Text fontSize="$3" style={{ color: colors.textMuted }}>
            {t("food.manufacturing")}: {formatDate(food.manufacturingDate, t("common.notInformed"))}
          </Text>
          <Text fontSize="$3" style={{ color: colors.textMuted }}>
            {t("food.expiration")}: {formatDate(food.expirationDate, t("common.notInformed"))}
          </Text>
        </XStack>

        {onEdit || onDelete ? (
          <XStack gap="$2" style={{ justifyContent: "flex-end" }}>
            {onEdit ? (
              <AppButton
                leftIcon={<MaterialCommunityIcons name="pencil-outline" size={16} />}
                size="$3"
                tone="secondary"
                onPress={() => onEdit(food)}
              >
                {t("actions.edit")}
              </AppButton>
            ) : null}
            {onDelete ? (
              <AppButton
                leftIcon={<MaterialCommunityIcons name="trash-can-outline" size={16} />}
                size="$3"
                tone="danger"
                onPress={() => onDelete(food)}
              >
                {t("actions.delete")}
              </AppButton>
            ) : null}
          </XStack>
        ) : null}
      </YStack>
    </AppCard>
  );
}

import { XStack, YStack } from "tamagui";

import { useTranslation } from "@/src/shared/i18n";
import { AppButton, FormField, PickerField } from "@/src/shared/ui";
import type { CreateFoodInput, Food, FoodStorage } from "@/types/food";
import { categories, getCategoryName } from "@/utils/foodDisplay";

export interface FoodItemEditorFormData {
  name: string;
  category: string;
  storage: FoodStorage;
  manufacturingDate: string;
  expirationDate: string;
}

interface FoodItemEditorFormProps {
  value: FoodItemEditorFormData;
  saving?: boolean;
  editingFood?: Food | null;
  onChange: (field: keyof FoodItemEditorFormData, value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

export const emptyFoodItemEditorForm: FoodItemEditorFormData = {
  name: "",
  category: "other",
  storage: "refrigerator",
  manufacturingDate: "",
  expirationDate: "",
};

export const toFoodItemEditorFormData = (food: Food): FoodItemEditorFormData => ({
  name: food.name,
  category: food.category,
  storage: food.storage,
  manufacturingDate: food.manufacturingDate ?? "",
  expirationDate: food.expirationDate,
});

export const toCreateFoodPayload = (form: FoodItemEditorFormData): CreateFoodInput => ({
  name: form.name.trim(),
  category: form.category,
  storage: form.storage,
  manufacturingDate: form.manufacturingDate || null,
  expirationDate: form.expirationDate,
});

export function FoodItemEditorForm({
  value,
  saving = false,
  editingFood,
  onChange,
  onSubmit,
  onCancel,
}: FoodItemEditorFormProps) {
  const { t } = useTranslation();
  const categoryOptions = categories.map((category) => ({
    label: getCategoryName(category, t),
    value: category,
  }));
  const storageOptions: { label: string; value: FoodStorage }[] = [
    { label: t("storage.refrigerator"), value: "refrigerator" },
    { label: t("storage.freezer"), value: "freezer" },
    { label: t("storage.pantry"), value: "pantry" },
  ];

  return (
    <YStack gap="$4">
      <FormField
        label={t("form.name")}
        placeholder={t("form.namePlaceholder")}
        value={value.name}
        onChangeText={(nextValue) => onChange("name", nextValue)}
      />

      <PickerField
        label={t("form.category")}
        value={value.category}
        options={categoryOptions}
        onChange={(nextValue) => onChange("category", nextValue)}
      />

      <PickerField
        label={t("form.storage")}
        value={value.storage}
        options={storageOptions}
        onChange={(nextValue) => onChange("storage", nextValue)}
      />

      <FormField
        label={t("form.manufacturingDate")}
        placeholder={t("form.expirationDatePlaceholder")}
        value={value.manufacturingDate}
        onChangeText={(nextValue) => onChange("manufacturingDate", nextValue)}
      />

      <FormField
        label={t("form.expirationDate")}
        placeholder={t("form.expirationDatePlaceholder")}
        value={value.expirationDate}
        onChangeText={(nextValue) => onChange("expirationDate", nextValue)}
      />

      <XStack gap="$3" mt="$2">
        {onCancel ? (
          <AppButton flex={1} tone="secondary" onPress={onCancel}>
            {t("actions.cancel")}
          </AppButton>
        ) : null}
        <AppButton flex={1} loading={saving} onPress={onSubmit}>
          {editingFood ? t("actions.saveChanges") : t("actions.createFood")}
        </AppButton>
      </XStack>
    </YStack>
  );
}

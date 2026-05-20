import { YStack } from "tamagui";

import { useTranslation } from "@/src/shared/i18n";
import { PickerField } from "@/src/shared/ui";
import type { FoodStorage, FoodValidityStatus } from "@/types/food";

interface InventoryFiltersProps {
  storageFilter: FoodStorage | "";
  validityFilter: FoodValidityStatus | "";
  onStorageChange: (value: FoodStorage | "") => void;
  onValidityChange: (value: FoodValidityStatus | "") => void;
}

export function InventoryFilters({
  storageFilter,
  validityFilter,
  onStorageChange,
  onValidityChange,
}: InventoryFiltersProps) {
  const { t } = useTranslation();
  const storageOptions: { label: string; value: FoodStorage | "" }[] = [
    { label: t("storage.all"), value: "" },
    { label: t("storage.refrigerator"), value: "refrigerator" },
    { label: t("storage.freezer"), value: "freezer" },
    { label: t("storage.pantry"), value: "pantry" },
  ];
  const validityOptions: { label: string; value: FoodValidityStatus | "" }[] = [
    { label: t("validity.all"), value: "" },
    { label: t("validity.expired"), value: "expired" },
    { label: t("validity.expiring_soon"), value: "expiring_soon" },
    { label: t("validity.valid"), value: "valid" },
  ];

  return (
    <YStack gap="$3">
      <PickerField label={t("form.storage")} value={storageFilter} options={storageOptions} onChange={onStorageChange} />
      <PickerField
        label={t("food.expiration")}
        value={validityFilter}
        options={validityOptions}
        onChange={onValidityChange}
      />
    </YStack>
  );
}

import type { Food } from "@/types/food";
import { getFoodStatusValue } from "@/utils/foodDisplay";
import { Badge } from "@/src/shared/ui";
import { useTranslation } from "@/src/shared/i18n";

interface ExpirationBadgeProps {
  food: Food;
}

const getTone = (food: Food) => {
  const status = getFoodStatusValue(food);

  if (status === "expired") return "danger";
  if (
    status === "expires_today" ||
    status === "expiring_soon"
  ) {
    return "warning";
  }
  if (status === "valid" || status === "ok") return "success";
  return "neutral";
};

export function ExpirationBadge({ food }: ExpirationBadgeProps) {
  const { t } = useTranslation();
  const label = food.statusLabel ?? (typeof food.daysUntilExpiration === "number" ? `${food.daysUntilExpiration} dias` : null);

  return <Badge label={label ?? t("common.statusUnavailable")} tone={getTone(food)} />;
}

import type { TranslationKey } from "@/src/shared/i18n";
import type { Food, FoodStorage } from "@/types/food";

export const storageLabels: Record<FoodStorage, string> = {
  refrigerator: "Geladeira",
  freezer: "Freezer",
  pantry: "Despensa",
};

export const categories = [
  "meat",
  "fruit",
  "vegetable",
  "seafood",
  "pasta",
  "sweets",
  "dairy",
  "condiments",
  "grains",
  "beverages",
  "eggs",
  "other",
];

type Translator = (key: TranslationKey) => string;

export const getCategoryName = (category: string, t?: Translator) => {
  const categoryKey = `categories.${category}` as TranslationKey;
  if (t && categories.includes(category)) return t(categoryKey);

  const labels: Record<string, string> = {
    meat: "Carne",
    fruit: "Fruta",
    vegetable: "Vegetal",
    seafood: "Fruto do mar",
    pasta: "Massas",
    sweets: "Doces",
    dairy: "Laticinio",
    condiments: "Condimentos",
    grains: "Graos",
    beverages: "Bebidas",
    eggs: "Ovos",
    other: "Outros",
  };

  return labels[category] ?? category;
};

export const formatDate = (dateString?: string | null, notInformedLabel = "Nao informado") => {
  if (!dateString) return notInformedLabel;
  const [date] = dateString.split("T");
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
};

export const getFoodStatusValue = (food: Food) =>
  food.validityStatus ?? food.expirationStatus ?? food.status ?? null;

export const getFoodStatusLabel = (food: Food, t?: Translator) => {
  if (food.statusLabel) return food.statusLabel;

  const status = getFoodStatusValue(food);
  const statusKey = status ? (`status.${status}` as TranslationKey) : null;
  if (statusKey && t) return t(statusKey);

  const labels: Record<string, string> = {
    expired: "Vencido",
    expires_today: "Vence hoje",
    expiring_soon: "Proximo da validade",
    valid: "Valido",
    ok: "Valido",
  };

  if (status && labels[status]) return labels[status];
  if (typeof food.daysUntilExpiration === "number") {
    return `${food.daysUntilExpiration} dias`;
  }
  return t ? t("common.statusUnavailable") : "Status indisponivel";
};

import type { Food, FoodStorage } from "@/types/food";

export const storageLabels: Record<FoodStorage, string> = {
  geladeira: "Geladeira",
  freezer: "Freezer",
  despensa: "Despensa",
};

export const categories = [
  "carne",
  "fruta",
  "vegetal",
  "fruto-do-mar",
  "massas",
  "doce",
  "laticinio",
  "condimentos",
  "graos",
  "bebidas",
  "ovos",
  "outros",
];

export const getCategoryName = (category: string) => {
  const labels: Record<string, string> = {
    carne: "Carne",
    fruta: "Fruta",
    vegetal: "Vegetal",
    "fruto-do-mar": "Fruto do mar",
    massas: "Massas",
    doce: "Doce",
    laticinio: "Laticinio",
    condimentos: "Condimentos",
    graos: "Graos",
    bebidas: "Bebidas",
    ovos: "Ovos",
    outros: "Outros",
  };

  return labels[category] ?? category;
};

export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Nao informado";
  const [date] = dateString.split("T");
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
};

export const getFoodStatusValue = (food: Food) =>
  food.validityStatus ?? food.expirationStatus ?? food.status ?? null;

export const getFoodStatusLabel = (food: Food) => {
  if (food.statusLabel) return food.statusLabel;

  const status = getFoodStatusValue(food);
  const labels: Record<string, string> = {
    expired: "Vencido",
    vencido: "Vencido",
    expires_today: "Vence hoje",
    vence_hoje: "Vence hoje",
    expiring_soon: "Proximo da validade",
    proximo: "Proximo da validade",
    valid: "Valido",
    ok: "Valido",
  };

  if (status && labels[status]) return labels[status];
  if (typeof food.daysUntilExpiration === "number") {
    return `${food.daysUntilExpiration} dias`;
  }
  return "Status indisponivel";
};

export const getFoodStatusColor = (food: Food) => {
  const status = getFoodStatusValue(food);

  if (status === "expired" || status === "vencido") return "#ef4444";
  if (
    status === "expires_today" ||
    status === "vence_hoje" ||
    status === "expiring_soon" ||
    status === "proximo"
  ) {
    return "#f59e0b";
  }
  if (status === "valid" || status === "ok") return "#10b981";
  return "#6b7280";
};

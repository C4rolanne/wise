export type FoodCategory =
  | "carne"
  | "fruta"
  | "vegetal"
  | "fruto-do-mar"
  | "massas"
  | "doce"
  | "laticinio"
  | "condimentos"
  | "graos"
  | "bebidas"
  | "ovos"
  | "outros"
  | string;

export type FoodStorage = "geladeira" | "freezer" | "despensa";

export type FoodValidityStatus =
  | "expired"
  | "expires_today"
  | "expiring_soon"
  | "valid"
  | "vencido"
  | "vence_hoje"
  | "proximo"
  | "ok"
  | string;

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  storage: FoodStorage;
  manufacturingDate?: string | null;
  expirationDate: string;
  validityStatus?: FoodValidityStatus | null;
  expirationStatus?: FoodValidityStatus | null;
  status?: FoodValidityStatus | null;
  statusLabel?: string | null;
  daysUntilExpiration?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodFilters {
  storage?: FoodStorage;
  validityStatus?: FoodValidityStatus;
  expiresBefore?: string;
  expiresAfter?: string;
}

export interface CreateFoodInput {
  name: string;
  category: FoodCategory;
  storage: FoodStorage;
  manufacturingDate?: string | null;
  expirationDate: string;
}

export type UpdateFoodInput = Partial<CreateFoodInput>;

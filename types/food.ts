export type FoodCategory =
  | "meat"
  | "fruit"
  | "vegetable"
  | "seafood"
  | "pasta"
  | "sweets"
  | "dairy"
  | "condiments"
  | "grains"
  | "beverages"
  | "eggs"
  | "other"
  | string;

export type FoodStorage = "refrigerator" | "freezer" | "pantry";

export type FoodValidityStatus =
  | "expired"
  | "expires_today"
  | "expiring_soon"
  | "valid"
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

import { apiRequest } from "./api";
import type { ApiListResponse } from "@/types/api";
import type { CreateFoodInput, Food, FoodFilters, UpdateFoodInput } from "@/types/food";

const normalizeFoodList = (response: Food[] | ApiListResponse<Food>) =>
  Array.isArray(response) ? response : response.data;

export const foodsService = {
  async list(filters: FoodFilters = {}) {
    const response = await apiRequest<Food[] | ApiListResponse<Food>>("/foods", {
      query: { ...filters },
    });
    return normalizeFoodList(response);
  },

  get(id: string) {
    return apiRequest<Food>(`/foods/${id}`);
  },

  create(input: CreateFoodInput) {
    return apiRequest<Food>("/foods", {
      method: "POST",
      body: input,
    });
  },

  update(id: string, input: UpdateFoodInput) {
    return apiRequest<Food>(`/foods/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  remove(id: string) {
    return apiRequest<void>(`/foods/${id}`, {
      method: "DELETE",
    });
  },
};

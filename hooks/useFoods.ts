import { useCallback, useEffect, useMemo, useState } from "react";

import { foodsService } from "@/services/foods.service";
import type { CreateFoodInput, Food, FoodFilters, UpdateFoodInput } from "@/types/food";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Erro inesperado";

export function useFoods(filters: FoodFilters = {}) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const filtersKey = JSON.stringify(filters);
  const stableFilters = useMemo(() => JSON.parse(filtersKey) as FoodFilters, [filtersKey]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setFoods(await foodsService.list(stableFilters));
    } catch (err) {
      setError(getErrorMessage(err));
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createFood = useCallback(
    async (input: CreateFoodInput) => {
      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        const createdFood = await foodsService.create(input);
        setSuccess("Alimento criado");
        await refresh();
        return createdFood;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  const updateFood = useCallback(
    async (id: string, input: UpdateFoodInput) => {
      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        const updatedFood = await foodsService.update(id, input);
        setSuccess("Alimento atualizado");
        await refresh();
        return updatedFood;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  const deleteFood = useCallback(
    async (id: string) => {
      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        await foodsService.remove(id);
        setSuccess("Alimento excluido");
        await refresh();
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  return {
    foods,
    loading,
    saving,
    error,
    success,
    refresh,
    createFood,
    updateFood,
    deleteFood,
  };
}

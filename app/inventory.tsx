import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { useAuth } from "@/hooks/useAuth";
import { useFoods } from "@/hooks/useFoods";
import {
  emptyFoodItemEditorForm,
  FoodItemCard,
  FoodItemEditorForm,
  InventoryFilters,
  type FoodItemEditorFormData,
  toCreateFoodPayload,
  toFoodItemEditorFormData,
} from "@/src/features/inventory/components";
import { useTranslation } from "@/src/shared/i18n";
import { AppShell } from "@/src/shared/navigation";
import { useAppPreferences } from "@/src/shared/theme";
import { AppBottomSheet, AppButton, SectionTitle, StateView } from "@/src/shared/ui";
import type { Food, FoodStorage, FoodValidityStatus } from "@/types/food";

export default function InventoryScreen() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const { colors } = useAppPreferences();
  const [storageFilter, setStorageFilter] = useState<FoodStorage | "">("");
  const [validityFilter, setValidityFilter] = useState<FoodValidityStatus | "">("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState<FoodItemEditorFormData>(emptyFoodItemEditorForm);

  const filters = useMemo(
    () => ({
      storage: storageFilter || undefined,
      validityStatus: validityFilter || undefined,
    }),
    [storageFilter, validityFilter],
  );

  const { foods, loading, saving, error, success, createFood, updateFood, deleteFood, refresh } =
    useFoods(filters);

  useEffect(() => {
    if (success) Alert.alert(t("alerts.success"), success);
  }, [success, t]);

  const openSheet = (food: Food | null = null) => {
    setEditingFood(food);
    setFormData(food ? toFoodItemEditorFormData(food) : emptyFoodItemEditorForm);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingFood(null);
    setFormData(emptyFoodItemEditorForm);
  };

  const handleChange = (field: keyof FoodItemEditorFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.category || !formData.storage || !formData.expirationDate) {
      Alert.alert(t("alerts.attention"), t("inventory.validateRequired"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = toCreateFoodPayload(formData);

      if (editingFood) {
        await updateFood(editingFood.id, payload);
      } else {
        await createFood(payload);
      }

      closeSheet();
    } catch (err) {
      Alert.alert(t("alerts.error"), err instanceof Error ? err.message : t("alerts.saveError"));
    }
  };

  const handleDelete = (food: Food) => {
    Alert.alert(t("alerts.deleteFood"), t("alerts.deleteFoodMessage", { name: food.name }), [
      { text: t("actions.cancel"), style: "cancel" },
      {
        text: t("actions.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFood(food.id);
          } catch (err) {
            Alert.alert(t("alerts.error"), err instanceof Error ? err.message : t("alerts.saveError"));
          }
        },
      },
    ]);
  };

  const renderContent = () => {
    if (authLoading || loading) {
      return <StateView loading title={t("inventory.loadingTitle")} description={t("inventory.loadingDescription")} />;
    }

    if (!isAuthenticated) {
      return (
        <StateView
          title={t("auth.requiredTitle")}
          description={t("auth.requiredInventoryDescription")}
          actionLabel={t("actions.signInGoogle")}
          onAction={signInWithGoogle}
        />
      );
    }

    if (error) {
      return (
        <StateView
          title={t("inventory.notLoaded")}
          description={error}
          actionLabel={t("actions.retry")}
          onAction={refresh}
        />
      );
    }

    if (foods.length === 0) {
      return (
        <StateView
          title={t("inventory.emptyTitle")}
          description={t("inventory.emptyDescription")}
          actionLabel={t("actions.addItem")}
          onAction={() => openSheet()}
        />
      );
    }

    return (
      <FlatList
        data={foods}
        keyExtractor={(food) => food.id}
        renderItem={({ item }) => <FoodItemCard food={item} onEdit={openSheet} onDelete={handleDelete} />}
        contentContainerStyle={{ gap: 12, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <>
      <AppShell
        title={t("inventory.title")}
        subtitle={t("inventory.filterDescription")}
        action={
          <AppButton leftIcon={<MaterialCommunityIcons name="plus" size={18} color={colors.primaryText} />} onPress={() => openSheet()}>
            {t("actions.addItem")}
          </AppButton>
        }
      >
        <YStack gap="$3">
          <SectionTitle title={t("inventory.filters")} description={t("inventory.filterDescription")} />
          <InventoryFilters
            storageFilter={storageFilter}
            validityFilter={validityFilter}
            onStorageChange={setStorageFilter}
            onValidityChange={setValidityFilter}
          />
        </YStack>

        <XStack style={{ alignItems: "center", justifyContent: "space-between" }}>
          <SectionTitle title={t("inventory.foodItems")} />
          <Text fontSize="$3" fontWeight="700" style={{ color: colors.textMuted }}>
            {t("common.itemsCount", { count: foods.length })}
          </Text>
        </XStack>

        <YStack flex={1}>{renderContent()}</YStack>
      </AppShell>

      <AppBottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <YStack gap="$4">
          <YStack>
            <Text fontSize="$6" fontWeight="900" style={{ color: colors.text }}>
              {editingFood ? t("actions.edit") : t("inventory.newFood")}
            </Text>
            <Text fontSize="$3" style={{ color: colors.textMuted }}>
              {t("inventory.saveNote")}
            </Text>
          </YStack>

          <FoodItemEditorForm
            editingFood={editingFood}
            saving={saving}
            value={formData}
            onCancel={closeSheet}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </YStack>
      </AppBottomSheet>
    </>
  );
}

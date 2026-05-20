import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { XStack, YStack } from "tamagui";

import { useAuth } from "@/hooks/useAuth";
import { useFoods } from "@/hooks/useFoods";
import { FoodItemCard, StorageLocationSelector } from "@/src/features/inventory/components";
import { AppShell } from "@/src/shared/navigation";
import { useTranslation } from "@/src/shared/i18n";
import { useAppPreferences } from "@/src/shared/theme";
import { AppButton, SectionTitle, StateView } from "@/src/shared/ui";
import type { Food, FoodStorage } from "@/types/food";

interface StorageInventoryScreenProps {
  storage: FoodStorage;
}

export function StorageInventoryScreen({ storage }: StorageInventoryScreenProps) {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { foods, loading, error, refresh } = useFoods({ storage });
  const { t } = useTranslation();
  const { colors } = useAppPreferences();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) refresh();
    }, [isAuthenticated, refresh]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const renderFood = ({ item }: { item: Food }) => <FoodItemCard compact food={item} />;

  const renderContent = () => {
    if (authLoading || loading) {
      return <StateView loading title={t("inventory.loadingTitle")} description={t("storage.subtitle")} />;
    }

    if (!isAuthenticated) {
      return (
        <StateView
          title={t("auth.requiredTitle")}
          description={t("auth.requiredStorageDescription")}
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
          title={t(`storage.empty.${storage}`)}
          description={t("inventory.emptyDescription")}
          actionLabel={t("actions.addItem")}
          onAction={() => router.push("/inventory")}
        />
      );
    }

    return (
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={renderFood}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ gap: 12, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <AppShell
      title={t(`storage.${storage}`)}
      subtitle={t("storage.subtitle")}
      contentMaxWidth={920}
      action={
        <XStack gap="$2">
          <AppButton
            chromeless
            circular
            icon={<MaterialCommunityIcons name="camera-outline" size={22} color={colors.primary} />}
            onPress={() => router.push("/scan")}
          />
          <AppButton
            circular
            icon={<MaterialCommunityIcons name="plus" size={24} color={colors.primaryText} />}
            style={{ height: 46, width: 46 }}
            onPress={() => router.push("/inventory")}
          />
        </XStack>
      }
    >
      <StorageLocationSelector selectedStorage={storage} />
      <SectionTitle title={t("storage.items")} description={t("storage.syncHint")} />
      <YStack flex={1}>{renderContent()}</YStack>
    </AppShell>
  );
}

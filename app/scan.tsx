import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { useAuth } from "@/hooks/useAuth";
import { useFoods } from "@/hooks/useFoods";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import {
  emptyFoodItemEditorForm,
  FoodItemEditorForm,
  type FoodItemEditorFormData,
  toCreateFoodPayload,
} from "@/src/features/inventory/components";
import { useTranslation } from "@/src/shared/i18n";
import { AppShell } from "@/src/shared/navigation";
import { appRadii, useAppPreferences } from "@/src/shared/theme";
import { AppButton, AppCard, ScreenContainer, StateView } from "@/src/shared/ui";
import type { FoodStorage } from "@/types/food";

export default function ScanScreen() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const { colors } = useAppPreferences();
  const { createFood, saving } = useFoods();
  const { imageUri, suggestion, loading, error, takePhoto, pickImage, reset } = useImageAnalysis();
  const [form, setForm] = useState<FoodItemEditorFormData>(emptyFoodItemEditorForm);

  useEffect(() => {
    if (!suggestion) return;

    setForm({
      name: suggestion.name ?? "",
      category: suggestion.category ?? "other",
      storage: (suggestion.storage as FoodStorage | undefined) ?? "refrigerator",
      manufacturingDate: suggestion.manufacturingDate ?? "",
      expirationDate: suggestion.expirationDate ?? "",
    });
  }, [suggestion]);

  const updateField = (field: keyof FoodItemEditorFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category || !form.storage || !form.expirationDate) {
      Alert.alert(t("alerts.attention"), t("scan.saveValidation"));
      return;
    }

    try {
      await createFood(toCreateFoodPayload(form));
      Alert.alert(t("alerts.success"), t("alerts.foodSaved"));
      reset();
      setForm(emptyFoodItemEditorForm);
      router.replace("/inventory");
    } catch (err) {
      Alert.alert(t("alerts.error"), err instanceof Error ? err.message : t("alerts.saveError"));
    }
  };

  if (authLoading) {
    return (
      <AppShell scroll title={t("scan.title")} subtitle={t("scan.subtitle")} contentMaxWidth={760}>
        <StateView loading title={t("home.loadingSession")} />
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <StateView
          title={t("auth.requiredTitle")}
          description={t("auth.requiredScanDescription")}
          actionLabel={t("actions.signInGoogle")}
          onAction={signInWithGoogle}
        />
      </ScreenContainer>
    );
  }

  return (
    <AppShell
      scroll
      title={t("scan.title")}
      subtitle={t("scan.subtitle")}
      contentMaxWidth={760}
    >
        <XStack gap="$3" style={{ flexDirection: "row" }}>
          <AppButton
            flex={1}
            leftIcon={<MaterialCommunityIcons name="camera-outline" size={18} color={colors.primaryText} />}
            loading={loading}
            onPress={takePhoto}
          >
            {t("actions.takePhoto")}
          </AppButton>
          <AppButton
            flex={1}
            leftIcon={<MaterialCommunityIcons name="image-plus" size={18} color={colors.text} />}
            tone="secondary"
            onPress={pickImage}
          >
            {t("actions.chooseImage")}
          </AppButton>
        </XStack>

        {loading ? <StateView loading title={t("scan.loadingTitle")} description={t("scan.loadingDescription")} /> : null}

        {error ? (
          <Text fontSize="$3" style={{ color: colors.danger, textAlign: "center" }}>
            {error}
          </Text>
        ) : null}

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ backgroundColor: colors.surfaceAlt, borderRadius: appRadii.lg, height: 260, width: "100%" }}
          />
        ) : null}

        {suggestion ? (
          <AppCard gap="$4">
            <YStack gap="$1">
              <Text fontSize="$6" fontWeight="900" style={{ color: colors.text }}>
                {t("scan.reviewSuggestion")}
              </Text>
              {typeof suggestion.confidence === "number" ? (
                <Text fontSize="$3" style={{ color: colors.textMuted }}>
                  {t("scan.confidence")}: {Math.round(suggestion.confidence * 100)}%
                </Text>
              ) : null}
              {suggestion.notes ? (
                <Text fontSize="$3" style={{ color: colors.textMuted }}>
                  {suggestion.notes}
                </Text>
              ) : null}
            </YStack>

            <FoodItemEditorForm value={form} saving={saving} onChange={updateField} onSubmit={handleSave} />
          </AppCard>
        ) : (
          <StateView
            title={t("scan.emptyTitle")}
            description={t("scan.emptyDescription")}
          />
        )}
    </AppShell>
  );
}

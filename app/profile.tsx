import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { Text, YStack } from "tamagui";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useTranslation } from "@/src/shared/i18n";
import { AppShell } from "@/src/shared/navigation";
import { appRadii, useAppPreferences } from "@/src/shared/theme";
import { AppButton, AppCard, FormField, ScreenContainer, StateView } from "@/src/shared/ui";

export default function ProfileScreen() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { user, loading, saving, error, success, update } = useUser();
  const { t } = useTranslation();
  const { colors } = useAppPreferences();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(user?.name ?? user?.fullName ?? "");
  }, [user]);

  useEffect(() => {
    if (success) Alert.alert(t("alerts.success"), success);
  }, [success, t]);

  const handleSave = async () => {
    try {
      await update({ name, fullName: name });
    } catch (err) {
      Alert.alert(t("alerts.error"), err instanceof Error ? err.message : t("alerts.profileUpdateError"));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (err) {
      Alert.alert(t("alerts.error"), err instanceof Error ? err.message : t("alerts.signOutError"));
    }
  };

  if (authLoading || loading) {
    return (
      <AppShell scroll title={t("profile.title")} subtitle={t("profile.subtitle")} contentMaxWidth={620}>
        <StateView loading title={t("profile.loading")} />
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <StateView
          title={t("auth.requiredTitle")}
          description={t("auth.requiredProfileDescription")}
          actionLabel={t("actions.signInGoogle")}
          onAction={signInWithGoogle}
        />
      </ScreenContainer>
    );
  }

  return (
    <AppShell scroll title={t("profile.title")} subtitle={t("profile.subtitle")} contentMaxWidth={620}>
        <AppCard gap="$4">
          <YStack gap="$3" style={{ alignItems: "center" }}>
            {user?.avatarUrl || user?.picture ? (
              <Image
                source={{ uri: user.avatarUrl ?? user.picture ?? "" }}
                style={{ borderRadius: 48, height: 96, width: 96 }}
              />
            ) : (
              <YStack
                style={{
                  alignItems: "center",
                  backgroundColor: colors.primarySoft,
                  borderRadius: appRadii.pill,
                  height: 96,
                  justifyContent: "center",
                  width: 96,
                }}
              >
                <Text fontSize="$8" fontWeight="900" style={{ color: colors.text }}>
                  {(name || user?.email || "U").charAt(0).toUpperCase()}
                </Text>
              </YStack>
            )}

            <Text fontSize="$3" style={{ color: colors.textMuted, textAlign: "center" }}>
              {user?.email}
            </Text>
          </YStack>

          <FormField label={t("form.name")} value={name} placeholder={t("form.profileNamePlaceholder")} onChangeText={setName} />

          {error ? (
            <Text fontSize="$3" style={{ color: colors.danger, textAlign: "center" }}>
              {error}
            </Text>
          ) : null}

          <AppButton
            leftIcon={<MaterialCommunityIcons name="content-save-outline" size={18} color={colors.primaryText} />}
            loading={saving}
            onPress={handleSave}
          >
            {t("actions.saveProfile")}
          </AppButton>

          <AppButton leftIcon={<MaterialCommunityIcons name="logout" size={18} color={colors.primaryText} />} tone="danger" onPress={handleSignOut}>
            {t("actions.signOut")}
          </AppButton>
        </AppCard>
    </AppShell>
  );
}

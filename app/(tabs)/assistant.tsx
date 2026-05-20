import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input, Text, XStack, YStack } from "tamagui";

import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useTranslation } from "@/src/shared/i18n";
import { AppShell } from "@/src/shared/navigation";
import { appRadii, useAppPreferences } from "@/src/shared/theme";
import { AppButton, AppCard, SkeletonBlock, StateView } from "@/src/shared/ui";
import { formatDate, getFoodStatusLabel } from "@/utils/foodDisplay";

export default function AssistantScreen() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { messages, loading, error, sendMessage, clear } = useChat();
  const { t } = useTranslation();
  const { colors } = useAppPreferences();
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;
    setInput("");
    await sendMessage(message);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const renderAssistantDetails = (messageId: string, message: (typeof messages)[number]) => (
    <YStack gap="$2" mt="$2">
      {message.warnings?.map((warning, index) => (
        <Text key={`${messageId}-warning-${index}`} fontSize="$3" style={{ color: colors.warning }}>
          {t("assistant.warning")}: {warning}
        </Text>
      ))}

      {message.prioritizedFoods?.map((food) => (
        <Text key={`${messageId}-food-${food.id}`} fontSize="$3" style={{ color: colors.text }}>
          {t("assistant.priority")}: {food.name} - {getFoodStatusLabel(food, t)} - {formatDate(food.expirationDate, t("common.notInformed"))}
        </Text>
      ))}

      {message.recipes?.map((recipe, index) => (
        <AppCard key={`${messageId}-recipe-${index}`} gap="$1">
          <Text fontSize="$4" fontWeight="900" style={{ color: colors.primary }}>
            {recipe.title ?? recipe.name ?? t("assistant.recipeIdea")}
          </Text>
          {recipe.description ? (
            <Text fontSize="$3" style={{ color: colors.textMuted }}>
              {recipe.description}
            </Text>
          ) : null}
          {recipe.ingredients?.length ? (
            <Text fontSize="$3" style={{ color: colors.textMuted }}>
              {t("assistant.ingredients")}: {recipe.ingredients.join(", ")}
            </Text>
          ) : null}
        </AppCard>
      ))}
    </YStack>
  );

  const renderBody = () => {
    if (authLoading) {
      return <StateView loading title={t("assistant.loading")} />;
    }

    if (!isAuthenticated) {
      return (
        <StateView
          title={t("auth.requiredTitle")}
          description={t("auth.requiredDescription")}
          actionLabel={t("actions.signInGoogle")}
          onAction={signInWithGoogle}
        />
      );
    }

    if (messages.length === 0) {
      return (
        <StateView
          title={t("assistant.emptyTitle")}
          description={t("assistant.emptyDescription")}
        />
      );
    }

    return messages.map((message) => {
      const isUser = message.role === "user";

      return (
        <XStack key={message.id} style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}>
          <YStack
            p="$3"
            style={{
              backgroundColor: isUser ? colors.primary : colors.surface,
              borderRadius: appRadii.lg,
              maxWidth: "86%",
            }}
          >
            <Text fontSize="$4" lineHeight="$5" style={{ color: isUser ? colors.primaryText : colors.text }}>
              {message.content}
            </Text>
            {!isUser ? renderAssistantDetails(message.id, message) : null}
          </YStack>
        </XStack>
      );
    });
  };

  return (
    <AppShell
      title={t("assistant.title")}
      subtitle={t("assistant.subtitle")}
      action={
        <AppButton
          chromeless
          circular
          icon={<MaterialCommunityIcons name="trash-can-outline" size={22} color={colors.primary} />}
          onPress={clear}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 24 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          style={{ flex: 1 }}
        >
          {renderBody()}
          {loading ? (
            <YStack p="$3" style={{ alignSelf: "flex-start", backgroundColor: colors.surface, borderRadius: appRadii.lg }}>
              <YStack gap="$2" style={{ width: 180 }}>
                <SkeletonBlock height={12} width="88%" />
                <SkeletonBlock height={12} width="64%" />
              </YStack>
            </YStack>
          ) : null}
          {error ? (
            <Text fontSize="$3" style={{ color: colors.danger, textAlign: "center" }}>
              {error}
            </Text>
          ) : null}
        </ScrollView>

        <XStack gap="$2" p="$3" style={{ alignItems: "center" }}>
          <Input
            flex={1}
            placeholder={t("assistant.messagePlaceholder")}
            value={input}
            onChangeText={setInput}
            disabled={!isAuthenticated || loading}
            onSubmitEditing={handleSend}
            style={{ backgroundColor: colors.surfaceAlt, borderRadius: appRadii.pill, borderWidth: 0, color: colors.text }}
          />
          <AppButton
            circular
            disabled={!input.trim() || loading}
            icon={<MaterialCommunityIcons name="send" size={20} color={colors.primaryText} />}
            style={{ height: 48, width: 48 }}
            onPress={handleSend}
          />
        </XStack>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

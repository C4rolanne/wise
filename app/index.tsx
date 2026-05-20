import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/src/shared/i18n";
import { useAppPreferences } from "@/src/shared/theme";
import { AppButton, ScreenContainer, SlidingSegmentedControl, StateView } from "@/src/shared/ui";

export default function Index() {
  const { isAuthenticated, loading, error, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const { colorScheme, language, colors, setColorScheme, setLanguage } = useAppPreferences();
  const petAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(tabs)/dashboard");
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(petAnimation, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(petAnimation, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [petAnimation]);

  const petTranslateY = petAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const petScale = petAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.045],
  });
  const petRotate = petAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-2deg", "2deg"],
  });

  return (
    <ScreenContainer>
      <XStack
        gap="$2"
        p="$4"
        style={{ flexWrap: "wrap", justifyContent: "flex-end" }}
      >
        <SlidingSegmentedControl
          value={colorScheme}
          width={190}
          options={[
            { label: t("common.themeLight"), value: "light" },
            { label: t("common.themeDark"), value: "dark" },
          ]}
          onChange={setColorScheme}
        />
        <SlidingSegmentedControl
          value={language}
          width={132}
          options={[
            { label: "PT", value: "pt-BR" },
            { label: "EN", value: "en" },
          ]}
          onChange={setLanguage}
        />
      </XStack>
      <YStack
        gap="$5"
        p="$6"
        style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: petTranslateY }, { scale: petScale }, { rotate: petRotate }],
          }}
        >
          <Image
            source={require("../assets/images/logo.png")}
            resizeMode="contain"
            style={{ height: 180, width: 180 }}
          />
        </Animated.View>
        <YStack gap="$2" style={{ alignItems: "center" }}>
          <Text fontSize="$10" fontWeight="900" lineHeight="$10" style={{ color: colors.text }}>
            FoodWise
          </Text>
          <Text fontSize="$4" lineHeight="$5" style={{ color: colors.textMuted, maxWidth: 420, textAlign: "center" }}>
            {t("home.subtitle")}
          </Text>
        </YStack>

        {loading ? <StateView loading title={t("home.loadingSession")} /> : null}

        {!loading && !isAuthenticated ? (
          <AppButton onPress={signInWithGoogle}>{t("actions.signInGoogle")}</AppButton>
        ) : null}

        {error ? (
          <Text fontSize="$3" style={{ color: colors.danger, textAlign: "center" }}>
            {error}
          </Text>
        ) : null}
      </YStack>
    </ScreenContainer>
  );
}

import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { YStack } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

export function SkeletonBlock({
  width,
  height,
  radius = appRadii.md,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
}) {
  const { colors } = useAppPreferences();
  const opacity = useRef(new Animated.Value(0.48)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 760,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.48,
          duration: 760,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        backgroundColor: colors.surfaceStrong,
        borderRadius: radius,
        height,
        opacity,
        width,
      }}
    />
  );
}

export function SkeletonState() {
  return (
    <YStack gap="$3" p="$6" style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
      <SkeletonBlock height={72} radius={appRadii.xl} width={72} />
      <SkeletonBlock height={22} width="56%" />
      <SkeletonBlock height={14} width="72%" />
      <SkeletonBlock height={14} width="48%" />
      <SkeletonBlock height={44} radius={appRadii.pill} width={180} />
    </YStack>
  );
}

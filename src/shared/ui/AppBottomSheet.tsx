import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { YStack } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

interface AppBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  maxWidth?: number;
}

export function AppBottomSheet({
  open,
  onOpenChange,
  children,
  maxWidth = 720,
}: AppBottomSheetProps) {
  const { colors } = useAppPreferences();
  const { width } = useWindowDimensions();
  const [isMounted, setIsMounted] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;
  const sheetWidth = Math.min(width - 24, maxWidth);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      Animated.spring(progress, {
        toValue: 1,
        damping: 22,
        mass: 0.8,
        stiffness: 180,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsMounted(false);
    });
  }, [open, progress]);

  const requestClose = () => onOpenChange(false);
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [64, 0],
  });
  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!isMounted) return null;

  return (
    <Modal transparent animationType="none" visible={isMounted} onRequestClose={requestClose}>
      <YStack style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View
          style={{
            backgroundColor: colors.overlay,
            bottom: 0,
            left: 0,
            opacity: overlayOpacity,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={requestClose} />
        </Animated.View>

        <Animated.View
          style={{
            alignSelf: "center",
            backgroundColor: colors.background,
            borderTopLeftRadius: appRadii.xl,
            borderTopRightRadius: appRadii.xl,
            maxHeight: "88%",
            overflow: "hidden",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -12 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            transform: [{ translateY }],
            width: sheetWidth,
          }}
        >
          <YStack p="$4" style={{ width: "100%" }}>
            <YStack
              mb="$3"
              style={{
                alignSelf: "center",
                backgroundColor: colors.surfaceStrong,
                borderRadius: appRadii.pill,
                height: 5,
                width: 56,
              }}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </YStack>
        </Animated.View>
      </YStack>
    </Modal>
  );
}

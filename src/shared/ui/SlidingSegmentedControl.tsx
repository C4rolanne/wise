import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { Text, XStack } from "tamagui";

import { appRadii, useAppPreferences } from "@/src/shared/theme";

interface SlidingSegmentedControlOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface SlidingSegmentedControlProps<TValue extends string> {
  value: TValue;
  options: SlidingSegmentedControlOption<TValue>[];
  onChange: (value: TValue) => void;
  width?: number;
}

export function SlidingSegmentedControl<TValue extends string>({
  value,
  options,
  onChange,
  width = 220,
}: SlidingSegmentedControlProps<TValue>) {
  const { colors } = useAppPreferences();
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const itemWidth = width / options.length;
  const translateX = useRef(new Animated.Value(selectedIndex * itemWidth)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: selectedIndex * itemWidth,
      damping: 22,
      mass: 0.7,
      stiffness: 190,
      useNativeDriver: true,
    }).start();
  }, [itemWidth, selectedIndex, translateX]);

  return (
    <XStack
      p="$1"
      style={{
        backgroundColor: colors.surfaceAlt,
        borderRadius: appRadii.pill,
        overflow: "hidden",
        position: "relative",
        width,
      }}
    >
      <Animated.View
        style={{
          backgroundColor: colors.primarySoft,
          borderRadius: appRadii.pill,
          bottom: 4,
          left: 4,
          position: "absolute",
          top: 4,
          transform: [{ translateX }],
          width: itemWidth - 8,
        }}
      />
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => ({
              alignItems: "center",
              cursor: "pointer",
              height: 38,
              justifyContent: "center",
              opacity: pressed ? 0.78 : 1,
              width: itemWidth,
            })}
          >
            <Text
              numberOfLines={1}
              fontSize="$2"
              fontWeight={selected ? "900" : "800"}
              style={{
                color: selected ? colors.text : colors.textMuted,
                position: "relative",
                zIndex: 1,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </XStack>
  );
}

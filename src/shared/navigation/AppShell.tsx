import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, usePathname, type Href } from "expo-router";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

import { useTranslation, type TranslationKey } from "@/src/shared/i18n";
import { appRadii, useAppPreferences } from "@/src/shared/theme";
import { AppButton } from "@/src/shared/ui";

interface AppShellProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  contentMaxWidth?: number;
}

type NavigationItem = {
  labelKey: TranslationKey;
  href: Href;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  matches: string[];
};

const navigationItems: NavigationItem[] = [
  {
    labelKey: "nav.dashboard",
    href: "/(tabs)/dashboard",
    icon: "view-dashboard-outline",
    matches: ["/dashboard"],
  },
  {
    labelKey: "nav.inventory",
    href: "/inventory",
    icon: "clipboard-list-outline",
    matches: ["/inventory"],
  },
  {
    labelKey: "nav.refrigerator",
    href: "/refrigerator",
    icon: "fridge-outline",
    matches: ["/refrigerator"],
  },
  {
    labelKey: "nav.freezer",
    href: "/freezer",
    icon: "snowflake",
    matches: ["/freezer"],
  },
  {
    labelKey: "nav.pantry",
    href: "/pantry",
    icon: "warehouse",
    matches: ["/pantry"],
  },
  {
    labelKey: "nav.scan",
    href: "/scan",
    icon: "camera-outline",
    matches: ["/scan"],
  },
  {
    labelKey: "nav.assistant",
    href: "/(tabs)/assistant",
    icon: "message-text-outline",
    matches: ["/assistant"],
  },
  {
    labelKey: "nav.profile",
    href: "/profile",
    icon: "account-circle-outline",
    matches: ["/profile"],
  },
];
const sidebarItemHeight = 46;
const sidebarItemGap = 6;

function SidebarItem({
  item,
  index,
  isActive,
  onNavigate,
}: {
  item: NavigationItem;
  index: number;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useAppPreferences();
  const [isHovered, setIsHovered] = useState(false);
  const label = t(item.labelKey);
  const textColor = isActive || isHovered ? colors.text : colors.textMuted;
  const iconColor = isActive || isHovered ? colors.primary : colors.textMuted;

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() => {
        onNavigate?.();
        router.push(item.href);
      }}
      style={({ pressed }) => ({
        borderRadius: appRadii.md,
        backgroundColor: isActive ? colors.primarySoft : isHovered ? colors.surfaceAlt : "transparent",
        cursor: "pointer",
        height: sidebarItemHeight,
        marginBottom: index === navigationItems.length - 1 ? 0 : sidebarItemGap,
        opacity: pressed ? 0.82 : 1,
        overflow: "hidden",
        position: "relative",
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <XStack
        gap="$3"
        px="$3"
        py="$2.5"
        style={{ alignItems: "center", position: "relative", zIndex: 1 }}
      >
        <MaterialCommunityIcons name={item.icon} size={20} color={iconColor} />
        <Text fontSize="$3" fontWeight={isActive ? "900" : "700"} style={{ color: textColor }}>
          {label}
        </Text>
      </XStack>
    </Pressable>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { colors } = useAppPreferences();
  const activeIndex = navigationItems.findIndex((item) =>
    item.matches.some((match) => pathname === match || pathname.endsWith(match)),
  );

  return (
    <YStack gap="$5" p="$4" style={{ flex: 1 }}>
      <YStack gap="$1">
        <XStack gap="$2" style={{ alignItems: "center" }}>
          <Image
            source={require("../../../assets/images/logo.png")}
            resizeMode="contain"
            style={{ height: 34, width: 34 }}
          />
          <Text fontSize="$7" fontWeight="900" style={{ color: colors.text }}>
            FoodWise
          </Text>
        </XStack>
        <Text fontSize="$2" style={{ color: colors.textMuted }}>
          {t("home.subtitle")}
        </Text>
      </YStack>

      <YStack>
        {navigationItems.map((item, index) => (
          <SidebarItem
            key={item.labelKey}
            index={index}
            isActive={index === activeIndex}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </YStack>
    </YStack>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  children,
  scroll = false,
  contentMaxWidth = 1040,
}: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuProgress = useRef(new Animated.Value(0)).current;
  const { height, width } = useWindowDimensions();
  const { colorScheme, language, colors, toggleColorScheme, toggleLanguage } = useAppPreferences();
  const { t } = useTranslation();
  const isWide = width >= 960;
  const isCompactHeader = width < 560;

  useEffect(() => {
    if (!isMenuOpen) return;

    Animated.spring(menuProgress, {
      toValue: 1,
      damping: 20,
      mass: 0.8,
      stiffness: 190,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen, menuProgress]);

  const closeMenu = () => {
    Animated.timing(menuProgress, {
      toValue: 0,
      duration: 190,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsMenuOpen(false);
    });
  };
  const openMenu = () => {
    menuProgress.setValue(0);
    setIsMenuOpen(true);
  };
  const sidebarTranslateX = menuProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-340, 0],
  });
  const backdropOpacity = menuProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const settingsControls = (
    <XStack gap="$2" style={{ alignItems: "center" }}>
      <AppButton
        chromeless
        circular
        aria-label={t("settings.theme")}
        icon={
          <MaterialCommunityIcons
            name={colorScheme === "light" ? "weather-night" : "white-balance-sunny"}
            size={21}
            color={colors.primary}
          />
        }
        onPress={toggleColorScheme}
      />
      <AppButton
        chromeless
        circular
        aria-label={t("settings.language")}
        onPress={toggleLanguage}
      >
        <Text fontSize="$2" fontWeight="900" style={{ color: colors.primary }}>
          {language === "pt-BR" ? "EN" : "PT"}
        </Text>
      </AppButton>
    </XStack>
  );

  const content = (
    <YStack
      gap="$4"
      p="$4"
      style={{
        alignSelf: "center",
        flex: scroll ? undefined : 1,
        maxWidth: contentMaxWidth,
        width: "100%",
      }}
    >
      {children}
    </YStack>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <XStack style={{ flex: 1 }}>
        {isWide ? (
          <YStack
            style={{
              backgroundColor: colors.backgroundElevated,
              borderBottomRightRadius: appRadii.xl,
              borderTopRightRadius: appRadii.xl,
              shadowColor: colors.shadow,
              shadowOffset: { width: 10, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 24,
              height,
              minHeight: height,
              width: 264,
            }}
          >
            <SidebarContent />
          </YStack>
        ) : null}

        <YStack style={{ backgroundColor: colors.background, flex: 1 }}>
          <XStack
            px="$4"
            py="$3"
            style={{
              alignItems: isCompactHeader ? "stretch" : "center",
              backgroundColor: colors.background,
              flexDirection: isCompactHeader ? "column" : "row",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <XStack gap="$3" style={{ alignItems: "center", flex: 1, minWidth: 0 }}>
              {!isWide ? (
                <AppButton
                  chromeless
                  circular
                  icon={<MaterialCommunityIcons name="menu" size={24} color={colors.text} />}
                  onPress={openMenu}
                />
              ) : null}

              <YStack gap="$1" style={{ flex: 1, minWidth: 0 }}>
                <Text fontSize="$6" fontWeight="900" lineHeight="$6" style={{ color: colors.text }}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text fontSize="$2" lineHeight="$3" style={{ color: colors.textMuted }}>
                    {subtitle}
                  </Text>
                ) : null}
              </YStack>
            </XStack>

            <XStack
              gap="$2"
              style={{
                alignItems: "center",
                alignSelf: isCompactHeader ? "flex-end" : "auto",
                flexShrink: 0,
                flexWrap: "wrap",
                justifyContent: "flex-end",
                maxWidth: isCompactHeader ? "100%" : undefined,
              }}
            >
              {settingsControls}
              {action}
            </XStack>
          </XStack>

          {scroll ? (
            <ScrollView
              contentContainerStyle={{ alignItems: "center", flexGrow: 1, paddingBottom: 32 }}
              style={{ flex: 1 }}
            >
              {content}
            </ScrollView>
          ) : (
            <YStack style={{ flex: 1 }}>{content}</YStack>
          )}
        </YStack>
      </XStack>

      <Modal transparent animationType="none" visible={isMenuOpen} onRequestClose={closeMenu}>
        <YStack style={{ flex: 1 }}>
          <Animated.View
            style={{
              backgroundColor: colors.overlay,
              bottom: 0,
              left: 0,
              opacity: backdropOpacity,
              position: "absolute",
              right: 0,
              top: 0,
              ...(isWide
                ? {}
                : ({
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                  } as object)),
            }}
          >
            <Pressable style={{ flex: 1 }} onPress={closeMenu} />
          </Animated.View>
          <Animated.View
            style={{
              backgroundColor: colors.backgroundElevated,
              borderBottomRightRadius: appRadii.xl,
              borderTopRightRadius: appRadii.xl,
              height,
              maxWidth: 320,
              minHeight: height,
              transform: [{ translateX: sidebarTranslateX }],
              width: "82%",
            }}
          >
            <XStack px="$4" py="$3" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <Text fontSize="$5" fontWeight="900" style={{ color: colors.text }}>
                {t("common.menu")}
              </Text>
              <AppButton
                chromeless
                circular
                icon={<MaterialCommunityIcons name="close" size={22} color={colors.text} />}
                onPress={closeMenu}
              />
            </XStack>
            <SidebarContent onNavigate={closeMenu} />
          </Animated.View>
        </YStack>
      </Modal>
    </SafeAreaView>
  );
}

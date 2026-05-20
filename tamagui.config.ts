import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

const appFontFamily =
  'Inter, Aptos, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const config = createTamagui({
  ...defaultConfig,
  fonts: {
    ...defaultConfig.fonts,
    body: {
      ...defaultConfig.fonts.body,
      family: appFontFamily,
      weight: {
        ...defaultConfig.fonts.body.weight,
        1: "400",
        4: "500",
        7: "700",
        9: "800",
      },
      letterSpacing: {
        ...defaultConfig.fonts.body.letterSpacing,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      },
    },
    heading: {
      ...defaultConfig.fonts.heading,
      family: appFontFamily,
      weight: {
        ...defaultConfig.fonts.heading.weight,
        1: "700",
        6: "800",
        9: "900",
      },
      letterSpacing: {
        ...defaultConfig.fonts.heading.letterSpacing,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      },
    },
  },
  settings: {
    ...defaultConfig.settings,
    defaultFont: "body",
    shouldAddPrefersColorThemes: true,
  },
});

export type AppTamaguiConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default config;

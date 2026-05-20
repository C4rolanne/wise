import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

const config = createTamagui({
  ...defaultConfig,
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

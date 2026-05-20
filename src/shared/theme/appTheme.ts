export type AppColorScheme = "light" | "dark";

export type AppThemeColors = {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceAlt: string;
  surfaceStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  primaryText: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  success: string;
  successSoft: string;
  info: string;
  infoSoft: string;
  overlay: string;
  shadow: string;
};

export const appRadii = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const foodWisePalette = {
  apricot: {
    50: "#fff7ef",
    100: "#fde9d4",
    200: "#f8c99f",
    300: "#f1a86c",
    400: "#d77d3b",
    500: "#aa551f",
    900: "#2b170b",
  },
  herb: {
    100: "#e4f2df",
    300: "#9ccc86",
    500: "#3f7a38",
    800: "#1f3b20",
  },
  tomato: {
    100: "#ffe5df",
    300: "#ff9b89",
    500: "#b93a25",
    800: "#522018",
  },
  honey: {
    100: "#fff1c8",
    300: "#f4bf53",
    600: "#8a5a0d",
    800: "#453016",
  },
  blueberry: {
    100: "#e2eefc",
    300: "#91bff2",
    600: "#2d5f99",
    800: "#203650",
  },
  neutral: {
    0: "#ffffff",
    50: "#fbf8f3",
    100: "#f2ede4",
    200: "#e5ddd0",
    500: "#756b5d",
    700: "#2b261f",
    900: "#14110d",
  },
} as const;

export const appThemes: Record<AppColorScheme, AppThemeColors> = {
  light: {
    background: foodWisePalette.neutral[50],
    backgroundElevated: foodWisePalette.neutral[0],
    surface: foodWisePalette.neutral[0],
    surfaceAlt: foodWisePalette.apricot[50],
    surfaceStrong: foodWisePalette.apricot[100],
    text: foodWisePalette.neutral[900],
    textMuted: foodWisePalette.neutral[500],
    textSubtle: "#9b9184",
    primary: foodWisePalette.apricot[300],
    primaryPressed: foodWisePalette.apricot[400],
    primarySoft: foodWisePalette.apricot[100],
    primaryText: foodWisePalette.apricot[900],
    danger: foodWisePalette.tomato[500],
    dangerSoft: foodWisePalette.tomato[100],
    warning: foodWisePalette.honey[600],
    warningSoft: foodWisePalette.honey[100],
    success: foodWisePalette.herb[500],
    successSoft: foodWisePalette.herb[100],
    info: foodWisePalette.blueberry[600],
    infoSoft: foodWisePalette.blueberry[100],
    overlay: "rgba(43, 23, 11, 0.42)",
    shadow: foodWisePalette.apricot[900],
  },
  dark: {
    background: foodWisePalette.neutral[900],
    backgroundElevated: "#1d1711",
    surface: "#241b13",
    surfaceAlt: "#31251a",
    surfaceStrong: "#4a3320",
    text: "#fff8ed",
    textMuted: "#d4c6b2",
    textSubtle: "#9d907f",
    primary: foodWisePalette.apricot[200],
    primaryPressed: foodWisePalette.apricot[300],
    primarySoft: "#4b321f",
    primaryText: foodWisePalette.apricot[900],
    danger: foodWisePalette.tomato[300],
    dangerSoft: foodWisePalette.tomato[800],
    warning: foodWisePalette.honey[300],
    warningSoft: foodWisePalette.honey[800],
    success: foodWisePalette.herb[300],
    successSoft: foodWisePalette.herb[800],
    info: foodWisePalette.blueberry[300],
    infoSoft: foodWisePalette.blueberry[800],
    overlay: "rgba(7, 5, 3, 0.68)",
    shadow: "#000000",
  },
};

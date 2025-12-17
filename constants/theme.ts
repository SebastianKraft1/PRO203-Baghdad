/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const brand = {
  primary: "#A569BD",
  accent: "#C39BD3",
  surface: "#F4F4FB",
  surfaceSoft: "#E5E7F5",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff", // Dette var #fff
    tint: brand.primary,

    icon: "#687076",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: brand.primary,

    primary: brand.primary,
    accent: brand.accent,
    surface: brand.surface,
    surfaceSoft: brand.surfaceSoft,
    card: "#FFFFFF",
    border: "#E5E7EB",

    danger: "#D9534F",
    mutedText: "#6B7280",
    button: "#E3E4E8",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#FFFFFF",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FFFFFF",

    primary: "#A78BFA",
    primaryDark: "#7C3AED",
    accent: "#C4B5FD",
    surface: "#111827",
    surfaceSoft: "#1F2937",
    card: "#111827",
    border: "#374151",
    danger: "#FCA5A5",
    mutedText: "#9CA3AF",
    button: "#E3E4E8",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

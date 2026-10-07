import { definePreset } from "./preset"

export const notion = definePreset({
  id: "notion",
  name: "Notion",
  description: "Warm ink, quiet blue.",
  swatch: "#8e8b86",
  inspiredBy: "Notion",
  diff: {
    // Color
    // The app token; #0075de is the marketing blue.
    brand: "#2783de",
    neutralHue: 81,
    neutralTint: 0.5,
    lightBg: 100,
    darkBg: 8.8,
    // Selected blocks and rows wash in blue; nav and tabs stay neutral.
    selectedWash: "brand",

    // Typography
    bodyFont: "Inter",
    uiTextSize: "13",

    // Shape
    radiusPx: 8,
    roleCard: "xl",

    // Space
    // 28px controls with 13px text; Notion pairs 28px with 14px.
    density: "compact",

    // Browser
    cursorDisabled: "default",

    // States
    focusInputStyle: "border",
    focusInputWeight: "thick",
    disabledTreatment: "fade",

    // Components
    linkUnderline: "always",
    linkColor: "neutral",
    menuSearch: "bar",
    tabStyle: "pill",
    accordionMarker: "leading-caret",
    breadcrumbSeparator: "slash",
    badgeStyle: "soft",
    badgeShape: "rounded",
  },
})

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

    // Typography
    bodyFont: "Inter",

    // Shape
    radiusPx: 8,
    roleCard: "xl",

    // Space
    // 28px controls; density stays default.
    spacingUnit: 3.5,

    // Browser
    cursorDragging: "grab",
    cursorDisabled: "default",

    // States
    focusInputStyle: "border",
    focusInputBorderWidth: 2,
    disabledTreatment: "fade",

    // Components
    linkUnderline: "always",
    linkColor: "neutral",
    menuSearch: "bar",
    tabStyle: "pill",
    accordionMarkerPosition: "leading",
    breadcrumbSeparator: "slash",
    badgeStyle: "soft",
    badgeShape: "rounded",
    kbdTreatment: "text",
  },
})

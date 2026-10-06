import { definePreset } from "./preset"

export const claude = definePreset({
  id: "claude",
  name: "Claude",
  description: "Ink actions, clay highlights.",
  swatch: "#d97757",
  inspiredBy: "Claude",
  diff: {
    // Color
    brand: "#d97757",
    // The live primary is ink; clay is never the default fill.
    buttonColor: "neutral",
    selectionColor: "neutral",
    neutralHue: 96,
    warningSeed: "#fab219",
    dangerSeed: "#d03b3b",
    selectionSeed: "#2a78d6",
    darkBg: 7,

    // Typography
    // Free stand-ins for Anthropic Serif and Sans.
    headingFont: "Source Serif 4",
    bodyFont: "Inter",

    // Icons
    // platform.claude.com draws on Phosphor's 256 grid.
    iconLibrary: "phosphor",

    // Shape
    radiusPx: 10.67,
    roleCard: "xl",

    // Surfaces
    surfaceShadow: "low",

    // States
    focusStyle: "duo",
    focusWidth: 1,
    focusInputStyle: "ring",

    // Components
    linkUnderline: "always",
    linkColor: "neutral",
    switchColor: "neutral",
    checkboxColor: "neutral",
    radioColor: "neutral",
    sliderColor: "neutral",
    tabStyle: "line",
    tabsColor: "accent",
    badgeStyle: "soft",
  },
})

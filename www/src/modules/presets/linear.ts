import { definePreset } from "./preset"

export const linear = definePreset({
  id: "linear",
  name: "Linear",
  description: "Indigo on near-black, pill actions.",
  swatch: "#828fff",
  inspiredBy: "Linear",
  diff: {
    // Color
    brand: "#5e6ad2",
    neutralHue: 262,
    successSeed: "#27a644",
    dangerSeed: "#eb5757",

    // Typography
    bodyFont: "Inter",

    // Shape
    radiusPx: 8,
    roleCard: "xl",

    // Surfaces
    surfaceShadow: "low",

    // Browser
    // The app's --pointer is default.
    cursorControls: "default",
    cursorDisabled: "default",

    // States
    focusWidth: 1,
    focusInputStyle: "border",
    disabledTreatment: "fade",

    // Components
    // Every app button computes 9999px.
    buttonRadius: "pill",
    inputHover: "edge",
    menuSearch: "prompt",
    dialogPosition: "top",
    tooltipStyle: "surface",
    tabStyle: "pill",
    badgeStyle: "outline",
  },
})

import { definePreset } from "./preset"

export const stripe = definePreset({
  id: "stripe",
  name: "Stripe",
  description: "Blurple fills, cool slate hairlines.",
  swatch: "#675dff",
  inspiredBy: "Stripe",
  diff: {
    // Color
    brand: "#533afd",
    neutralHue: 260,
    successSeed: "#228403",
    dangerSeed: "#df1b41",
    neutralTint: 2,
    lightBg: 100,

    // Typography
    // Söhne is proprietary; Inter is the closest free grotesque.
    bodyFont: "Inter",
    monoFont: "Source Code Pro",

    // Shape
    radiusPx: 8,
    roleControl: "lg",
    roleItem: "sm",
    roleCard: "xl",

    // Surfaces
    surfaceShadow: "low",

    // States
    // Stripe's flush halo fails on blurple fills; Inset's bg line reads.
    focusStyle: "inset",
    focusInputWeight: "thick",

    // Components
    pickerCaret: "double",
    tabStyle: "line",
    tabsColor: "accent",
    badgeStyle: "soft-outline",
    menuRows: "step",
    badgeShape: "rounded",
  },
})

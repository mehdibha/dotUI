import { DEFAULTS } from "@/modules/studio/axes"

import { definePreset } from "./preset"

export const spotify = definePreset({
  id: "spotify",
  name: "Spotify",
  description: "Vivid green on near-black.",
  swatch: "#1ed760",
  inspiredBy: "Spotify",
  diff: {
    // Color
    brand: "#1ed760",
    successSeed: "#1ed760",
    warningSeed: "#ffa42b",
    dangerSeed: "#e91429",
    neutralTint: 0,
    preserveSeed: true,
    lightBg: 100,
    darkBg: 5.5,

    // Typography
    // Circular is proprietary; Figtree is the closest free geometric.
    bodyFont: "Figtree",

    // Shape
    radiusPx: 8,
    roleControl: "full",
    rolePanel: "lg",
    roleCard: "lg",

    // Space
    // Live controls are 32/48px; comfortable is the closest tier.
    density: "comfortable",

    // Surfaces
    surfaceLayers: "tonal",
    surfaceEdge: "none",

    // Browser
    selectionHighlight: "browser",

    // States
    focusColor: "neutral",
    // An inset ring measured ~1.1:1 on the fills; duo stands in.
    focusStyle: "duo",
    focusInputStyle: "ring",
    disabledTreatment: "fade",

    // Motion
    popoverMotion: { ...DEFAULTS.popoverMotion, pattern: "slide" },
    tooltipMotion: { ...DEFAULTS.tooltipMotion, pattern: "slide" },
    modalMotion: { ...DEFAULTS.modalMotion, pattern: "slide" },

    // Components
    linkUnderline: "hover",
    linkColor: "neutral",
    buttonRadius: "pill",
    toggleSelected: "inverse",
    inputStyle: "filled",
    inputHover: "tint",
    sliderColor: "neutral",
    tooltipStyle: "surface",
    tabStyle: "line",
    badgeStyle: "soft",
    badgeShape: "rounded",
  },
})

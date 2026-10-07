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
    // Field, checkbox and radio edges are #7c7c7c, far above the dividers.
    controlEdge: "strong",

    // Typography
    // Circular is proprietary; Figtree is the closest free geometric.
    bodyFont: "Figtree",
    // Fields set 16px values.
    fieldTextSize: "large",

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
    // A #000 frame around 8px-rounded #121212 panels.
    shellTone: "recessed",

    // Browser
    selectionHighlight: "browser",

    // States
    focusColor: "neutral",
    // A bare inset ring measured ~1.1:1 on the fills; the bg line reads.
    focusStyle: "inset",
    focusInputStyle: "ring",
    disabledTreatment: "fade",

    // Motion
    motionEntrance: "slide",
    dialogEntrance: "rise",

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

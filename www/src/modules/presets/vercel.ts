import { definePreset } from "./preset"

export const vercel = definePreset({
  id: "vercel",
  name: "Vercel",
  description: "Monochrome ink, Geist blue accents.",
  swatch: "#8f8f8f",
  inspiredBy: "Vercel",
  diff: {
    // Color
    // Geist blue for focus and links; the solids stay ink via the neutral leaves.
    brand: "#0072f5",
    buttonColor: "neutral",
    selectionColor: "neutral",
    successSeed: "#45a557",
    warningSeed: "#ffb224",
    dangerSeed: "#e5484d",
    neutralTint: 0,
    lightBg: 100,
    darkBg: 0,

    // Icons
    // Geist's 1.5/16 stroke on Lucide's 24 grid.
    iconStroke: 2.25,

    // Shape
    radiusPx: 8,
    roleItem: "md",
    roleSurface: "xl",
    roleCard: "xl",

    // Space
    // Geist's default control is 36px.
    density: "comfortable",

    // States
    focusInputWidth: 3,

    // Components
    spinnerStyle: "blades",
    segmentedTrack: "outline",
    checkboxColor: "neutral",
    radioColor: "neutral",
    cardSelected: "outline-tint",
    cardControl: "end",
    inputHover: "edge",
    sliderColor: "neutral",
    menuSearch: "prompt",
    tabStyle: "line",
  },
})

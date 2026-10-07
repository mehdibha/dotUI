import { definePreset } from "./preset"

export const airbnb = definePreset({
  id: "airbnb",
  name: "Airbnb",
  description: "Rausch accents, ink actions.",
  swatch: "#ff385c",
  inspiredBy: "Airbnb",
  diff: {
    // Color
    brand: "#ff385c",
    // Primary CTAs and selection are ink #222; Rausch stays the accent.
    buttonColor: "neutral",
    selectionColor: "neutral",
    successSeed: "#038026",
    warningSeed: "#eb6100",
    dangerSeed: "#d7251c",
    neutralTint: 0,
    preserveSeed: true,
    lightBg: 100,
    darkBg: 5,

    // Typography
    // Cereal is proprietary; Plus Jakarta Sans is the closest free match.
    bodyFont: "Plus Jakarta Sans",

    // Shape
    radiusPx: 16,
    roleSurface: "md",
    roleCard: "xl",

    // Space
    density: "comfortable",

    // Surfaces
    surfaceEdge: "none",
    surfaceShadow: "low",

    // Browser
    selectionHighlight: "browser",

    // States
    // Airbnb never rings in Rausch.
    focusColor: "neutral",
    focusInputStyle: "border",
    focusInputWeight: "thick",

    // Motion
    motionEntrance: "slide",
    dialogEntrance: "rise",

    // Mobile
    mobileDialogs: "sheet",

    // Components
    linkUnderline: "always",
    linkColor: "neutral",
    spinnerStyle: "dots",
    segmentedSelected: "raised",
    segmentedTrack: "outline",
    switchColor: "neutral",
    checkboxColor: "neutral",
    checkCorner: "sharp",
    radioColor: "neutral",
    cardSelected: "outline-tint",
    inputHover: "edge",
    numberLayout: "split",
    calendarDayShape: "circle",
    calendarWeekdays: "double",
    sliderColor: "neutral",
    menuInset: "full-bleed",
    tabStyle: "line",
    paginationCurrent: "primary",
    badgeStyle: "soft",
    badgeShape: "rounded",
  },
})

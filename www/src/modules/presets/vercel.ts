import { definePreset } from "./preset"

export const vercel = definePreset({
  id: "vercel",
  name: "Vercel",
  description: "Monochrome ink, Geist blue accents.",
  swatch: "#8f8f8f",
  inspiredBy: "Vercel",
  diff: {
    // Color
    // Geist blue-700 inks links, focus, switch, slider and choice cards; solids stay ink.
    brand: "#0072f5",
    preserveSeed: true,
    buttonColor: "neutral",
    selectionColor: "neutral",
    checkboxColor: "neutral",
    radioColor: "neutral",
    // Success is blue in Geist (Note, Toast); green is palette only.
    successSeed: "#0072f5",
    // amber-700: the 800 fill (#ff990a) loses its black label in the engine.
    warningSeed: "#ffb224",
    // red-800, the fill Geist paints error buttons and toasts with.
    dangerSeed: "#da2f35",
    neutralTint: 0,
    // background-200: #fafafa page, #000 in dark.
    lightBg: 98.5,
    darkBg: 0,
    // Fields and outline buttons wear the gray-alpha-400 hairline.
    controlEdge: "soft",

    // Surfaces
    // White background-100 cards on the #fafafa shell.
    surfaceLayers: "grouped",
    shellTone: "page",

    // Typography
    titleStyle: "tight",

    // Icons
    // Geist Icons are proprietary; Lucide at their 1.5/16 line weight.
    iconStroke: 2.25,

    // Shape
    // Base 8: controls 6, checks 4, menus and modals 12.
    radiusPx: 8,
    roleItem: "md",
    roleSurface: "xl",
    roleCard: "md",

    // Space
    // 32/36/40 controls.
    density: "comfortable",

    // States
    // Fields focus with a neutral 4px halo under the blue ring.
    focusInputWeight: "thick",
    focusInputColor: "neutral",
    invalidStyle: "halo",

    // Motion
    // Menus fade in without zooming.
    motionEntrance: "fade",

    // Components
    buttonSecondary: "outline",
    segmentedTrack: "outline",
    // Checks wear gray-700 (#8f8f8f), stronger than the field edge.
    checkEdge: "strong",
    radioMark: "ring",
    cardSelected: "outline-tint",
    // Blue choice cards beside black checks.
    cardColor: "accent",
    inputHover: "edge",
    inputError: "icon-message",
    selectTrigger: "field",
    sliderTrack: "medium",
    menuRows: "match",
    // The command input is bare text over a hairline, no magnifier.
    menuSearch: "prompt",
    dialogBackdrop: "wash",
    dialogBackdropStrength: "heavy",
    dialogSections: "footer-band",
    dialogActions: "spread",
    mobileDialogs: "sheet",
    tabStyle: "line",
    navWeight: "regular",
    linkUnderline: "hover",
    alertStyle: "outline",
    toastStatus: "bold",
    spinnerStyle: "blades",
    progressTrack: "thick",
    kbdTreatment: "outline",
    cardFooter: "band",
  },
})

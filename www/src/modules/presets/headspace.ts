import { definePreset } from "./preset"

export const headspace = definePreset({
  id: "headspace",
  name: "Headspace",
  description: "Warm grays, blue pill CTAs, ink selection, big soft targets.",
  swatch: "#ff7300",
  inspiredBy: "Headspace",
  diff: {
    // Color
    // primary blue-200 #0061ef; the orange-200 #ff7300 brand dot stays on the logo.
    brand: "#0061ef",
    preserveSeed: true,
    // Warm grays #f9f4f2…#2d2c2b sit at OKLCH hue 68–85, chroma at most .012.
    neutralHue: 75,
    neutralTint: 0.6,
    successSeed: "#02873e",
    warningSeed: "#ffb700",
    dangerSeed: "#e01919",
    lightBg: 100,
    // Stand-in: dark is a navy #050726 (L* 2.9, OKLCH chroma .064) that one
    // neutral hue can't reach next to the warm light grays.
    darkBg: 3,

    // Typography
    // Headspace Apercu is proprietary; DM Sans is the closest free match.
    bodyFont: "DM Sans",
    // Stand-in: titles are 700 at -0.03em; Bold keeps the weight, not the tracking.
    titleStyle: "bold",
    labelWeight: "bold",

    // Shape
    // Base 16: fields and menus 12, cards 8, dialogs 24 (radii small 12, small-x 8, large 24).
    radiusPx: 16,
    roleSurface: "md",
    roleCard: "sm",
    // Fields, checks and dividers draw 2px warm-grey edges.
    controlStroke: "bold",

    // Space
    // Buttons 48 (mLarge) and 56 (large) with 24px sides and 16px labels.
    density: "touch",

    // Surfaces
    // Cards are warm-grey-100 #f9f4f2 tiles on white, no border.
    surfaceLayers: "tonal",
    surfaceEdge: "none",
    // Stand-in: cards and the primary button sit on a 2px unblurred lip,
    // 0 2px 0 #14131333.
    surfaceShadow: "low",

    // States
    // A 2px blue-200 edge, no ring.
    focusInputStyle: "thick-edge",
    // Disabled controls drop to 40% opacity.
    disabledTreatment: "fade",

    // Buttons
    buttonRadius: "pill",
    // interactive-strong #f9f4f2, no edge.
    buttonSecondary: "soft",

    // Toggles
    // Selected chips, segments and the current page flip to warm-grey-700 #2d2c2b.
    toggleSelected: "inverse",
    segmentedSelected: "inverse",

    // Selection
    // Checkbox edges are border-stronger #63605d, radios border-strongest #2d2c2b.
    checkEdge: "strong",
    // A blue ring around an 8px blue dot.
    radioMark: "ring",
    // Stand-in: a 4px corner on a 16px box; the 16px base's detail rung is 8.
    checkCorner: "sharp",
    // Stand-in: choice options are cream pills whose selected edge turns
    // border-stronger #63605d (3px); no pill or tonal option here.
    cardSelected: "outline",
    cardColor: "neutral",

    // Inputs
    inputHover: "edge",
    // Stand-in: fields and select triggers are 56px under 48px buttons.
    inputHeight: "step",
    selectTrigger: "field",

    // Menus & popovers
    // Square 48px option rows reach the popup's edge.
    menuInset: "full-bleed",
    menuRows: "match",

    // Dialogs
    // #00000080 behind the dialog, no blur.
    dialogBackdrop: "scrim",
    // A full-width primary under centered copy.
    dialogActions: "stack",

    // Navigation
    // Bold 20px tabs over a 2px ink bar.
    navWeight: "bold",
    tabStyle: "line",
    linkUnderline: "always",
    paginationCurrent: "selected",

    // Feedback
    // contrast-background #050726 toasts in light, #f9f4f2 in dark.
    toastStyle: "inverse",
  },
})

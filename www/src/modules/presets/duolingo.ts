import { definePreset } from "./preset"

export const duolingo = definePreset({
  id: "duolingo",
  name: "Duolingo",
  description: "Feather green on ledges, chunky and uppercase.",
  swatch: "#58cc02",
  inspiredBy: "Duolingo",
  diff: {
    // Color
    // owl #58cc02 for CTAs and progress; macaw #1cb0f6 for selection and focus.
    brand: "#58cc02",
    preserveSeed: true,
    // White labels on owl in light (2.09:1, priced); dark labels in dark.
    solidInk: "white",
    selectionSeed: "#1cb0f6",
    successSeed: "#58cc02",
    warningSeed: "#ffc800",
    dangerSeed: "#ff4b4b",
    neutralTint: 0,
    lightBg: 100,
    // Swan #e5e5e5 strokes every control and surface alike.
    controlEdge: "soft",

    // Typography
    // Duolingo Sans is proprietary; the brand guidelines name Nunito as its substitute.
    bodyFont: "Nunito",
    titleStyle: "bold",
    labelWeight: "bold",
    sectionLabels: "caps",

    // Icons
    iconStroke: 2.5,

    // Shape
    // Buttons 16px, fields and tiles 12px, menu rows 7px.
    radiusPx: 16,
    roleItem: "xs",
    controlStroke: "bold",
    // Buttons 50px, fields 48px, small 32px.
    density: "touch",

    // Surfaces: cards and choice tiles stand on a 2px lip.
    surfaceEdge: "ledge",
    shellTone: "page",

    // States
    focusInputStyle: "border",
    cursorDisabled: "default",

    // Buttons
    buttonStyle: "ledge",
    buttonCase: "uppercase",
    toggleSelected: "tint",

    // Inputs: Ledge's Auto field is the polar well; no hover.
    inputHover: "none",

    // Selection
    // Checks stay square-ish (8px web-ui box); the 16px base would round them to circles.
    checkCorner: "sharp",
    cardSelected: "outline-tint",
    switchStyle: "slab",

    // Menus & popovers
    menuArrows: "both",
    // No check on the current item; the row tint marks it.
    menuIndicator: "none",
    menuSelectedRow: "tint",

    // Dialogs
    dialogBackdrop: "scrim",
    dialogActions: "stack",
    dialogClose: "filled",
    mobileDialogs: "fullscreen",

    // Navigation
    tabStyle: "line",
    tabsColor: "accent",
    navMarker: "outline",
    navWeight: "bold",

    // Feedback
    badgeStyle: "soft",
    badgeShape: "rounded",
    badgeCase: "uppercase",
    spinnerStyle: "dots",
    progressTrack: "x-heavy",

    // Data display
    kbdTreatment: "outline",
    calendarDayShape: "circle",
  },
})

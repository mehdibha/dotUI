import { definePreset } from "./preset"

export const carbon = definePreset({
  id: "carbon",
  name: "Carbon",
  description: "Square, tonal and bottom-lined, IBM blue on gray layers.",
  swatch: "#0f62fe",
  inspiredBy: "IBM Carbon",
  diff: {
    // Color
    brand: "#0f62fe",
    preserveSeed: true,
    successSeed: "#24a148",
    warningSeed: "#f1c21b",
    dangerSeed: "#da1e28",
    neutralTint: 0,
    lightBg: 100,
    darkBg: 7,
    selectionHighlight: "browser",
    // Checks, radios and the slider are #161616.
    checkboxColor: "neutral",
    radioColor: "neutral",
    sliderColor: "neutral",

    // Typography
    bodyFont: "IBM Plex Sans",
    titleStyle: "display",
    labelWeight: "normal",

    // Icons
    iconStroke: 1.5,

    // Shape: zero radius everywhere; tags, toggles and thumbs stay round.
    roleControl: "none",
    roleItem: "none",
    roleSurface: "none",
    rolePanel: "none",
    roleCard: "none",
    density: "comfortable",

    // Surfaces: flat tonal layers, no edges.
    surfaceLayers: "tonal",
    surfaceEdge: "none",

    // States: an inset 2px blue focus.
    focusStyle: "inset",
    focusInputStyle: "ring",

    // Buttons
    buttonSecondary: "solid",
    groupSeparator: "divider",
    segmentedSelected: "inverse",
    segmentedTrack: "outline",

    // Inputs: #f4f4f4 fields with a single bottom line.
    inputStyle: "indicator",
    inputError: "icon-field",
    selectTrigger: "field",
    otpStyle: "separate",

    // Selection
    checkCorner: "sharp",
    radioMark: "ring",
    sliderThumb: "solid",
    sliderTrack: "hairline",
    cardSelected: "outline",

    // Menus & popovers
    menuInset: "full-bleed",
    menuArrows: "both",
    menuIndicator: "check-start",
    menuSelectedRow: "tint",
    mobilePickers: "anchored",

    // Dialogs: full-bleed action bar under a heavy scrim.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "heavy",
    dialogActions: "bleed",
    dialogEntrance: "drop",
    mobileDialogs: "fullscreen",

    // Navigation: a blue bar marks the current tab and nav item.
    tabStyle: "line",
    tabsColor: "accent",
    navMarker: "fill-bar",
    navWeight: "regular-semibold",
    linkUnderline: "hover",
  },
})

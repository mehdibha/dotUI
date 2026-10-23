import { definePreset } from "./preset"

export const chatgpt = definePreset({
  id: "chatgpt",
  name: "ChatGPT",
  description: "Black pill buttons on white, pure grays, system type.",
  // The original ChatGPT teal; the UI itself is monochrome.
  swatch: "#10a37f",
  inspiredBy: "ChatGPT",
  diff: {
    // Color
    // blue-400 #0285ff marks focus, links, info and switches (#3a83f7 in the
    // app); actions and checks are ink.
    brand: "#0285ff",
    buttonColor: "neutral",
    selectionColor: "neutral",
    successSeed: "#00a240",
    warningSeed: "#e25507",
    dangerSeed: "#e02e2a",
    // Grays carry no hue: #0d0d0d ink, #f0f0f0 and #efefef fills.
    neutralTint: 0,
    // #fcfcfc page, #000 in dark.
    darkBg: 0,

    // Typography
    bodyFont: "System",
    monoFont: "System Mono",
    // Headings 600 at normal tracking.
    titleStyle: "compact",

    // Shape
    // 8px fields and rows, 16px menus and cards.
    radiusPx: 8,
    roleControl: "lg",
    roleItem: "lg",
    roleSurface: "2xl",
    rolePanel: "2xl",
    roleCard: "2xl",

    // Space
    // 36px buttons, selects and menu rows.
    density: "comfortable",

    // States
    // Fields: the edge recolors, no halo (ChatGPT darkens it to 50% ink).
    focusInputStyle: "border",

    // Buttons
    // Pills by default; secondary buttons are a gray fill with no edge.
    // Paint scales to .97.
    buttonSecondary: "soft",
    buttonRadius: "pill",
    buttonPress: "scale",
    // Settings' segmented control picks with a flat gray chip.
    segmentedSelected: "tone",

    // Selection
    checkboxColor: "neutral",
    radioColor: "neutral",
    // A white knob ringed in #767676 over a 4px track.
    sliderThumb: "ring",
    sliderColor: "neutral",

    // Inputs
    inputHover: "edge",
    pickerCaret: "double",

    // Dates
    calendarDayShape: "circle",
    calendarToday: "dot",
    calendarWeekdays: "double",

    // Menus & popovers
    // Rows as tall as controls; menus at 90% with a 16px blur.
    menuRows: "match",
    translucentOverlays: true,
    menuArrows: "none",
    // Stand-in: tooltips are a #0d0d0d chip in light but #303030 in dark.

    // Dialogs
    // Black at 13% in both modes, no blur.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "light",

    // Navigation
    navItemWeight: "regular",
    // Stand-in: category tabs mark the current one by ink alone.
    tabStyle: "pill",
    // The sidebar shares the page's tone in both modes.
    shellTone: "page",

    // Feedback
    alertStyle: "outline",
    badgeStyle: "soft",
  },
})

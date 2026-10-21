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
    // blue-400 #0285ff marks focus, links, info and the dark-mode switch;
    // actions and checks are ink.
    brand: "#0285ff",
    buttonColor: "neutral",
    selectionColor: "neutral",
    successSeed: "#00a240",
    warningSeed: "#e25507",
    dangerSeed: "#e02e2a",
    // Grays carry no hue: #0d0d0d ink, #ededed and #f9f9f9 fills.
    neutralTint: 0,
    // #fff page. Stand-in: #1e1e1e in dark; #212121 (L* 12.75) puts dark
    // edges too close to popovers for the legibility floor.
    lightBg: 100,
    darkBg: 11,

    // Typography
    bodyFont: "System",
    monoFont: "System Mono",
    // Headings 600 at normal tracking.
    titleStyle: "compact",

    // Shape
    // 8px fields and tooltips, 6px menu rows inside 12px menus.
    radiusPx: 8,
    roleControl: "lg",
    roleItem: "md",
    roleSurface: "xl",
    rolePanel: "2xl",

    // States
    // Fields: the 16% ring darkens to 50% ink, no halo.
    focusInputStyle: "border",
    focusInputColor: "neutral",

    // Buttons
    // Pills by default; outline buttons ring at 16% ink. Paint scales to .97.
    buttonSecondary: "outline",
    buttonRadius: "pill",
    buttonPress: "scale",
    // A white thumb with a soft drop on a #ededed pill track.
    segmentedSelected: "raised",

    // Selection
    checkboxColor: "neutral",
    radioColor: "neutral",
    // Stand-in: switches are ink in light; dark mode turns them #0285ff.
    switchColor: "neutral",
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
    // 32px rows, as tall as controls.
    menuRows: "match",
    menuArrows: "none",
    tooltipStyle: "surface",

    // Dialogs
    // Black at 30%, 50% in dark, no blur.
    dialogBackdrop: "scrim",

    // Navigation
    navItemWeight: "regular",
    // The sidebar sits below the page in both modes: #f9f9f9, #181818 in dark.
    shellTone: "recessed",

    // Feedback
    alertStyle: "outline",
    badgeStyle: "soft",
    badgeShape: "rounded",
  },
})

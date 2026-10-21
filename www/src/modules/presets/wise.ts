import { definePreset } from "./preset"

export const wise = definePreset({
  id: "wise",
  name: "Wise",
  description: "Bright green pills, forest ink, roomy rounded fields.",
  swatch: "#9fe870",
  inspiredBy: "Wise",
  diff: {
    // Style
    // Panels and prompts sit on a forest-tinted gray with no border or shadow;
    // only menus and tooltips float, on a soft 40px shadow.
    style: "tonal",
    surfaceShadow: "flat",
    // Field, checkbox and radio edges are #868685.
    controlEdge: "strong",

    // Color
    // Bright green #9fe870 under the CTA in both themes.
    brand: "#9fe870",
    preserveSeed: true,
    // Stand-in: checks, chips, focus, links and the selected day are forest
    // #163300 in light and the bright green in dark; ink is nearest across both.
    selectionColor: "neutral",
    successSeed: "#054d28",
    warningSeed: "#ffd11a",
    dangerSeed: "#cb272f",
    // Grays lean green at OKLCH chroma ~.004.
    neutralTint: 0.35,
    lightBg: 100,
    // background-screen #121511.
    darkBg: 6.5,

    // Typography
    bodyFont: "Inter",
    // Titles 600 at -2% (30 / 26 / 22 / 18px).
    titleStyle: "tight",
    // Buttons, chips and labels are 600.
    labelWeight: "semibold",

    // Shape
    // Fields and menus 10px, prompts and tooltips 16, dialogs 32, tags 6.
    radiusPx: 10.5,
    roleControl: "lg",
    roleItem: "lg",
    rolePanel: "3xl",

    // Space
    // Buttons, fields and menu rows 48px with 16px text; buttons pad 16, not 24.
    density: "touch",

    // Surfaces
    shellTone: "page",

    // States
    // A 2px forest ring 2px off the edge; fields thicken to 3px.
    focusColor: "neutral",
    focusInputStyle: "border",
    focusInputWeight: "thick",

    // Links
    // Forest #163300 at 600 in light, the bright green in dark.
    linkUnderline: "always",
    linkColor: "neutral",

    // Buttons
    buttonRadius: "pill",
    // Selected chips fill forest under bright-green labels. Chips are 32px
    // and outlined at rest, which has no option.
    toggleSelected: "solid",
    // Stand-in: a page-colored chip with no edge, on a pill track.
    segmentedSelected: "ring",

    // Inputs
    // A page-colored box in both themes; Outline tints the dark fill.
    inputStyle: "inset",
    fieldLabel: "semibold",
    selectTrigger: "field",

    // Selection
    switchColor: "neutral",
    checkboxColor: "neutral",
    radioColor: "neutral",
    sliderColor: "neutral",
    radioMark: "ring",
    checkCorner: "sharp",

    // Menus & popovers
    menuRows: "match",
    tooltipStyle: "surface",

    // Dialogs
    dialogBackdrop: "scrim",
    dialogClose: "filled",

    // Navigation
    tabStyle: "line",
    // Regular #454745 tabs; the current one forest at 600.
    navWeight: "regular-semibold",

    // Feedback
    alertStyle: "soft",
    badgeStyle: "soft",
    badgeShape: "rounded",
    // 8px, filled forest like the checks.
    progressTrack: "thick",
    progressColor: "same-checks",

    // Data display
    calendarDayShape: "circle",
    // Stand-in: today is underlined.
    calendarToday: "dot",
    calendarWeekdays: "triple",
  },
})

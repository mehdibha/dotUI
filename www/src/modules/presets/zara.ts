import { definePreset } from "./preset"

export const zara = definePreset({
  id: "zara",
  name: "Zara",
  description: "Black hairlines, light caps, square and shadowless.",
  swatch: "#949494",
  inspiredBy: "Zara",
  diff: {
    // Color
    // Black and white: the store paints nothing blue but focus (ds.dotui.org
    // docs, refs/zara). An ink brand keeps accent chips, status dots and
    // charts achromatic; the info blue #0170e9 rides focus alone.
    brand: "#000000",
    focusColor: "custom",
    focusCustomColor: "#0170e9",
    buttonColor: "neutral",
    selectionColor: "neutral",
    successSeed: "#0a882a",
    warningSeed: "#b66009",
    dangerSeed: "#e90d01",
    neutralTint: 0,
    // White page; the shipped zds-theme--dark is #000.
    lightBg: 100,
    darkBg: 0,
    // Outline buttons and frames are 0.5px black; field lines #797979.
    controlEdge: "strong",

    // Typography
    // Stand-in: Helvetica Now Text 300 is proprietary and the builder loads
    // 400 up; Work Sans 400 matches its caps width at the lightest ink.
    bodyFont: "Work Sans",
    // Buttons, fields and toggles are 13px.
    uiTextSize: "13",
    // Titles are 15/300 product names, not a display scale.
    titleStyle: "display",
    labelWeight: "normal",
    // |01| SORT BY: 11px capitals.
    sectionLabels: "caps",

    // Icons
    // Thin line icons (close, bookmark, chat).
    iconStroke: 1,

    // Shape: square everywhere.
    roleControl: "none",
    roleItem: "none",
    roleSurface: "none",
    rolePanel: "none",

    // Surfaces
    shellTone: "page",

    // States
    // Focus is a 2px #0170e9 outline 2px off the edge; fields a 2px bottom line.
    focusInputStyle: "thick-edge",

    // Buttons
    // Secondary: white inside a 0.5px black line.
    buttonSecondary: "outline",
    buttonCase: "uppercase",
    // VIEW 1 2 3: bare numbers on the page, no track or chip.
    segmentedSelected: "ring",
    segmentedTrack: "outline",

    // Selection
    checkboxColor: "neutral",
    checkEdge: "strong",
    radioColor: "neutral",
    // Stand-in: no radios on the store; a ring around a dot, like the bag
    // checkbox's square inside a square.
    radioMark: "ring",
    switchColor: "neutral",
    sliderColor: "neutral",
    // The price range: a 1px line between black dots.
    sliderThumb: "solid",
    sliderTrack: "hairline",

    // Inputs
    // Bottom line only, 0.5px; the login field is 40px.
    inputStyle: "underline",
    inputHeight: "step",
    inputError: "icon-message",
    selectTrigger: "field",
    // The bag stepper: − 1 +.
    numberLayout: "split",
    otpStyle: "separate",

    // Dialogs
    // rgba(255,255,255,.75), no blur; stacked full-width actions.
    dialogBackdrop: "wash",
    dialogBackdropStrength: "heavy",
    dialogActions: "stack",

    // Navigation
    tabStyle: "line",
    // Side nav: 300 at rest, 500 current, no fill or bar. Tabs and the VIEW
    // picker keep one weight; the current one shows by a dot or opacity.
    navMarker: "ink",
    navWeight: "regular",
    navItemWeight: "regular-medium",
    linkUnderline: "always",
    linkColor: "neutral",

    // Feedback
    // Stand-in: NEW is plain 10px text with no box; the soft neutral tint is
    // the faintest chip.
    badgeStyle: "soft",
    badgeShape: "rounded",
    badgeCase: "uppercase",

    // Data display
    // Size guide headers: 12/500 in black, no band.
    tableHeaderLabel: "strong",
    // Nothing on the store is round but the stores map's controls; a rounded
    // avatar takes the square character.
    avatarShape: "rounded",
  },
})

import { definePreset } from "./preset"

export const guardian = definePreset({
  id: "guardian",
  name: "The Guardian",
  description:
    "Navy pills, serif headlines, large touch controls, square cards.",
  swatch: "#0077b6",
  inspiredBy: "The Guardian",
  diff: {
    // Color
    // Source brand[400] #052962 fills primary buttons and the masthead.
    brand: "#052962",
    preserveSeed: true,
    // brand[500] #0077b6 paints checks, radios and Source links.
    selectionSeed: "#0077b6",
    successSeed: "#22874d",
    dangerSeed: "#c70000",
    // Pure grays: #121212 ink, #707070 field edges, #dcdcdc rules.
    neutralTint: 0,
    // #ffffff page; #1a1a1a in DCR's dark mode.
    lightBg: 100,
    darkBg: 9,
    // Fields and checks ring at #707070 (neutral[46]).
    controlEdge: "strong",

    // Typography
    // Stand-ins: Hanken Grotesk for Guardian Text Sans, Newsreader for GH
    // Guardian Headline, Literata for Guardian Text Egyptian.
    bodyFont: "Hanken Grotesk",
    headingFont: "Newsreader",
    readingFont: "Literata",
    // Button labels are 17/700.
    labelWeight: "bold",

    // Icons
    // Source icons are thin, filled paths.
    iconStroke: 1.5,

    // Shape
    // 4px fields, checks and alerts; the edition menu at 3px; square cards.
    radiusPx: 4,
    roleControl: "lg",
    roleSurface: "md",
    // Square edition-menu rows and Most viewed tabs.
    roleItem: "none",
    roleCard: "none",

    // Space
    // 44px buttons and fields, 17px control text.
    density: "touch",

    // States
    // Buttons: Source focusHaloSpaced, a 5px #0077b6 outline 3px out.
    focusWidth: 4,
    // Stand-in: fields take Source focusHalo, a solid 3px #0077b6 shadow
    // hugging the edge; the field ring is the closest solid one.
    focusInputStyle: "ring",

    // Buttons
    // Primary and tertiary priorities: navy pills, the tertiary outlined.
    buttonRadius: "pill",
    buttonSecondary: "outline",

    // Segmented control
    // Stand-in: the support picker's current option is a white chip on a
    // navy band, with no shadow.
    segmentedSelected: "ring",

    // Selection
    // Selected radios draw a 2px ring around a dot.
    radioMark: "ring",
    // ChoiceCard: #e3f6ff under a #0077b6 edge when checked.
    cardSelected: "outline-tint",

    // Inputs
    // Labels are 17/700.
    fieldLabel: "semibold",
    selectTrigger: "field",

    // Menus & popovers
    // The edition picker: square 44px rows, a tick before the current one.
    menuInset: "full-bleed",
    menuRows: "match",
    menuIndicator: "check-start",

    // Navigation
    // Stand-in: Most viewed marks its current tab with a 4px top bar.
    tabStyle: "line",
    // Most viewed tabs are 17/600.
    navWeight: "semibold",
    linkUnderline: "always",

    // Feedback
    // Keyword tags: outlined pills, 14/400.
    badgeStyle: "outline",
    // InfoSummary: a 2px #0077b6 edge on the page, no fill.
    alertStyle: "outline",
  },
})

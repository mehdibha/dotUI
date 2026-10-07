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
    // Pure grays (swan #e5e5e5). A slate tint barely reaches the dark page
    // (chroma .006 of #131f24's .02) yet blues the light ink.
    neutralTint: 0,
    lightBg: 100,
    // #131f24 is L* 11.
    darkBg: 11,
    // Swan #e5e5e5 strokes every control and surface alike.
    controlEdge: "soft",

    // Typography
    // Duolingo Sans is proprietary; the brand guidelines name Nunito as its substitute.
    bodyFont: "Nunito",
    titleStyle: "bold",
    labelWeight: "bold",
    sectionLabels: "caps",

    // Icons
    // The close X is stroke 3 on a 16px box.
    iconStroke: 3,

    // Shape
    // Fields, tiles and web-ui buttons 12px; popovers, cards and modals 16px; menu rows 7px.
    radiusPx: 16,
    roleItem: "sm",
    rolePanel: "lg",
    controlStroke: "bold",
    // Buttons 50px, fields 48px, small 32px.
    density: "touch",

    // Surfaces: cards and choice tiles stand on a 2px lip.
    surfaceEdge: "ledge",
    shellTone: "page",

    // States
    focusInputStyle: "border",
    cursorDisabled: "default",

    // Selection
    // No ::selection rule; the browser default shows.
    selectionHighlight: "browser",

    // Buttons
    buttonStyle: "ledge",
    buttonCase: "uppercase",
    toggleSelected: "tint",

    // Inputs: Ledge's Auto field is the polar well; no hover.
    inputHover: "none",
    fieldLabel: "medium",

    // Selection controls
    // A quarter of the box (8px on 32, 5px on 20): 4px on our 16px check, nearer Sharp than the 8px detail rung.
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
    // Below 700px the modal goes full-bleed.
    mobileDialogs: "fullscreen",

    // Navigation
    tabStyle: "line",
    tabsColor: "accent",
    // The COURSES bar spans the label, not the padded tab.
    tabIndicator: "label",
    navMarker: "outline",
    navWeight: "bold",

    // Feedback
    // The lesson feedback sheet: sea-sponge #d7ffb8 under tree-frog ink.
    alertStyle: "soft",
    badgeStyle: "soft",
    badgeShape: "rounded",
    badgeCase: "uppercase",
    spinnerStyle: "dots",
    // 16px track.
    progressTrack: "x-heavy",

    // Data display
    kbdTreatment: "outline",
    avatarFallback: "accent",
    calendarDayShape: "circle",
    // Today carries no marker by default.
    calendarToday: "numeral",
  },
})

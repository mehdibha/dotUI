import { definePreset } from "./preset"

export const duolingo = definePreset({
  id: "duolingo",
  name: "Duolingo",
  description: "Feather green on ledges, chunky and uppercase.",
  swatch: "#58cc02",
  inspiredBy: "Duolingo",
  diff: {
    // Assets
    brandAssets: "duolingo",

    // Style
    style: "chunky",

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
    // Stand-in: Duolingo Sans is proprietary; Nunito keeps its rounded terminals.
    bodyFont: "Nunito",
    titleStyle: "bold",
    labelWeight: "bold",
    sectionLabels: "caps",

    // Icons
    // The close X is stroke 3 on a 16px box.
    iconStroke: 3,

    // Shape
    // Fields, choice tiles and web-ui buttons 12px; popovers, cards and modals 16px.
    // Stand-in: lesson and log-in buttons are 16px, but a larger control radius also rounds fields past 12px.
    radiusPx: 16,
    roleItem: "sm",
    rolePanel: "lg",
    // Course tiles 16px, like the modal.
    roleCard: "lg",
    controlStroke: "bold",
    // Buttons 50px with the lip, fields 48px, small 32px.
    // Stand-in: touch pads buttons 24px and sets 16px labels; Duolingo pads 16px, labels 15px (17px in lessons).
    density: "touch",

    // Surfaces: cards and choice tiles stand on a 2px lip.
    shellTone: "page",

    // States
    focusInputStyle: "border",
    cursorDisabled: "default",

    // Selection
    // No ::selection rule; the browser default shows.
    selectionHighlight: "browser",

    // Buttons
    buttonCase: "uppercase",
    toggleSelected: "tint",

    // Inputs: Ledge's Auto field is the polar well; no hover.
    inputHover: "none",
    // Settings labels are 20px bold ("Dark mode"); semibold is the heaviest rung.
    fieldLabel: "semibold",

    // Selection controls
    // A quarter of the box (8px on 32, 5px on 20): 4px on our 16px check, nearer Sharp than the 8px detail rung.
    checkCorner: "sharp",
    cardSelected: "outline-tint",
    switchStyle: "slab",

    // Menus & popovers
    // The More menu's rows span its width, square, 20px in from the edge.
    menuInset: "full-bleed",
    menuSelectedRow: "tint",
    menuArrows: "both",
    // No check on the current item; the row tint marks it.
    menuIndicator: "none",
    // The path's callouts: page fill, 2px swan edge, radius 10.
    tooltipStyle: "surface",

    // Dialogs: the Ledge stroke is a stand-in, Duolingo's modal has no edge.
    // Black at 30–40%, no blur.
    dialogBackdrop: "scrim",
    dialogActions: "stack",
    dialogClose: "filled",
    // Below 700px the modal goes full-bleed.
    mobileDialogs: "fullscreen",

    // Navigation
    tabStyle: "line",
    tabsColor: "accent",
    navMarker: "outline",
    navWeight: "bold",

    // Feedback
    // The lesson feedback sheet: sea-sponge #d7ffb8 under tree-frog ink.
    alertStyle: "soft",
    badgeStyle: "soft",
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

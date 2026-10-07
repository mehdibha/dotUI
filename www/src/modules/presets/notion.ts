import { definePreset } from "./preset"

export const notion = definePreset({
  id: "notion",
  name: "Notion",
  description: "Warm ink, quiet blue.",
  swatch: "#8e8b86",
  inspiredBy: "Notion",
  diff: {
    // Color
    // The app's --c-bluBacAccPri; #0075de is the marketing blue.
    brand: "#2783de",
    preserveSeed: true,
    // White on #2783de (3.9:1), as the login Continue button.
    solidInk: "white",
    // Warm grays at OKLCH ~82°, about half the engine's lean.
    neutralHue: 82,
    neutralTint: 0.5,
    successSeed: "#46a171",
    warningSeed: "#d8a32f",
    dangerSeed: "#e56458",
    lightBg: 100,
    // #191919.
    darkBg: 9,
    // Fields and outline buttons share the rgba(28,19,1,.11) hairline.
    controlEdge: "soft",

    // Typography
    // The app runs on the OS stack; Inter is only the login face.
    bodyFont: "System",
    monoFont: "System Mono",
    titleStyle: "compact",
    // 14/20 UI text on Compact's 28px controls.
    uiTextSize: "14",
    fieldLabel: "medium",

    // Icons
    // Proprietary outline set; 1.25px on a 20 grid.
    iconStroke: 1.5,

    // Shape
    // Controls and rows 6, menus 10, dialogs 12, checkbox 3.
    radiusPx: 6.5,
    roleControl: "lg",
    roleSurface: "xl",
    rolePanel: "2xl",

    // Space
    // md buttons and inputs are 28px.
    density: "compact",

    // Surfaces
    surfaceShadow: "low",

    // States
    focusInputStyle: "border",
    focusInputWeight: "thick",
    disabledTreatment: "fade",
    cursorDisabled: "default",

    // Buttons
    buttonSecondary: "outline",
    // Settings switches: a white chip on a gray track.
    segmentedSelected: "raised",

    // Selection
    // Unchecked box: a 1px rgba(27,21,0,.19) edge.
    checkEdge: "strong",
    cardSelected: "outline",

    // Menus and overlays
    menuArrows: "none",
    // Rows are the control height (28px).
    menuRows: "match",
    menuSearch: "bar",
    menuScale: "large",
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "heavy",
    dialogActions: "stack",
    mobileDialogs: "sheet",

    // Navigation
    tabStyle: "pill",
    linkUnderline: "always",
    linkColor: "neutral",
    breadcrumbSeparator: "slash",

    // Feedback
    alertStyle: "soft",
    toastStyle: "inverse",
    spinnerStyle: "ring-track",
    badgeStyle: "soft",
    badgeShape: "rounded",

    // Display
    accordionContainer: "plain",
    accordionMarker: "leading-caret",
    calendarDayShape: "circle",
    calendarWeekdays: "triple",
  },
})

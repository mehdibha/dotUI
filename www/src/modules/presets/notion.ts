import { definePreset } from "./preset"

export const notion = definePreset({
  id: "notion",
  name: "Notion",
  description: "Warm ink, quiet blue.",
  swatch: "#8e8b86",
  inspiredBy: "Notion",
  diff: {
    // Assets
    brandAssets: "notion",

    // Style: low drops; settings switches are a white chip on a gray track.
    surfaceShadow: "low",
    segmentedSelected: "raised",

    // Color
    // The app's --c-bluBacAccPri; #0075de is the marketing blue.
    brand: "#2783de",
    preserveSeed: true,
    // Stand-in: labels on #2783de are #f3f9fd, a white tinted with the blue.
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
    // Outline buttons draw rgba(28,19,1,.11) (#e6e5e3). Unchecked boxes
    // (#d4d3cf) land on the Firm floor that a soft edge gives checks.
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

    // States
    focusInputStyle: "thick-edge",
    disabledTreatment: "fade",
    cursorDisabled: "default",
    cursorDrag: "grab",

    // Buttons
    buttonSecondary: "outline",

    // Selection
    cardSelected: "outline",

    // Menus and overlays
    menuArrows: "none",
    // Rows are the control height (28px).
    menuRows: "match",
    menuSearch: "bar",
    // Stand-in: the search palette's 16px prompt in a 48px band. Its rows
    // stay 36px at 14px; large sets them 40px at 16px.
    menuScale: "large",
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "heavy",
    dialogActions: "stack",
    mobileDialogs: "sheet",

    // Navigation
    // Stand-in: view tabs are fully round pills with 12px padding.
    tabStyle: "pill",
    // Sidebar rows stay 14/400 when selected.
    navItemWeight: "regular",
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
    calendarWeekdays: "triple",
  },
})

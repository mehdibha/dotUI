import { definePreset } from "./preset"

export const linear = definePreset({
  id: "linear",
  name: "Linear",
  description: "Quiet grays, indigo accent, pill actions.",
  swatch: "#828fff",
  inspiredBy: "Linear",
  diff: {
    // Color
    brand: "#5e6ad2",
    // Grays sit near OKLCH chroma 0.002.
    neutralTint: 0.2,
    successSeed: "#26a544",
    warningSeed: "#f0bf00",
    dangerSeed: "#f34e52",
    // Content panel #f8f8f9 / #111212.
    lightBg: 97.5,
    darkBg: 5.5,

    // Typography
    bodyFont: "Inter",
    // Berkeley Mono is commercial.
    monoFont: "JetBrains Mono",
    uiTextSize: "13",

    // Icons
    // Linear's set is proprietary; its 1.5/16 stroke on Lucide's 24 grid.
    iconStroke: 2.25,

    // Shape
    // Fields 8px; menus, dialogs and toasts 12px.
    radiusPx: 8,
    roleControl: "lg",
    roleSurface: "xl",

    // Surfaces
    // White menus and dialogs over the #f8f8f9 panel.
    surfaceLayers: "grouped",
    surfaceShadow: "low",
    // An #efeff0 frame around a bordered #f8f8f9 panel.
    shellTone: "recessed",

    // States
    focusWidth: 1,
    focusInputStyle: "border",
    disabledTreatment: "fade",
    // The app's --pointer is default.
    cursorControls: "default",
    cursorDisabled: "default",

    // Buttons
    // Near-white controlSecondary with a ring and a low drop.
    buttonSecondary: "raised",
    // Every app button computes 9999px.
    buttonRadius: "pill",
    segmentedTrack: "outline",

    // Selection
    // Checkbox 1px #7c7c7c against #d2d2d2 fields.
    checkEdge: "strong",

    // Inputs
    inputHover: "edge",
    fieldLabel: "medium",
    inputError: "icon-message",
    // The trigger keeps the 8px field corner while buttons are pills.
    selectTrigger: "field",

    // Menus & popovers
    menuArrows: "none",
    // Menu rows 32px, the control height.
    menuRows: "match",
    menuSearch: "prompt",
    // ⌘K: 720px, 46px rows, 15px text.
    menuScale: "large",
    tooltipStyle: "surface",

    // Dialogs
    // Black 25% / 40%, no blur.
    dialogBackdrop: "scrim",
    // Flex spacers 1:2, the upper third.
    dialogPosition: "top",
    drawerEdge: "detached",

    // Navigation
    tabStyle: "pill",
    // Sidebar items keep 510 when current.
    navItemWeight: "medium",
    linkUnderline: "hover",
    accordionMarker: "leading-caret",

    // Feedback
    alertStyle: "outline",
    spinnerStyle: "dots",

    // Data display
    badgeStyle: "dot",
    kbdTreatment: "outline",
    avatarFallback: "accent",
    calendarDayShape: "circle",
    calendarToday: "ring",
    calendarWeekdays: "double",
  },
})

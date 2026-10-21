import { definePreset } from "./preset"

export const linear = definePreset({
  id: "linear",
  name: "Linear",
  description: "Quiet grays, indigo accent, pill actions.",
  swatch: "#828fff",
  inspiredBy: "Linear",
  diff: {
    // Assets
    brandAssets: "linear",

    // Style: low drops on menus and dialogs; a near-white secondary with a ring.
    surfaceShadow: "low",
    buttonSecondary: "raised",

    // Color
    brand: "#5e6ad2",
    // Grays sit near OKLCH chroma 0.002.
    neutralTint: 0.2,
    successSeed: "#26a544",
    warningSeed: "#f0bf00",
    dangerSeed: "#f34e52",
    // Content panel #f9f9fa / #121213.
    lightBg: 98,
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
    // White menus and dialogs over the #f9f9fa panel.
    surfaceLayers: "grouped",
    // An #efeff0 / #09090a frame around the bordered panel.
    shellTone: "recessed",

    // States
    // outline: 1px solid accent at 0px offset, hugging the control.
    focusStyle: "halo",
    focusStrength: "solid",
    focusWidth: 1,
    focusInputStyle: "border",
    disabledTreatment: "fade",
    // The app's --pointer is default.
    cursorControls: "default",
    cursorDisabled: "default",

    // Buttons
    // Every app button computes 9999px.
    buttonRadius: "pill",
    segmentedTrack: "outline",

    // Selection
    // Checkbox 1px #7c7c7c against #d8d8d8 fields.
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
    // Body ink, no underline at rest or on hover.
    linkColor: "neutral",
    accordionMarker: "leading-caret",

    // Feedback
    // The error callout: red 10% fill, 20% border, red text.
    alertStyle: "soft-outline",
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

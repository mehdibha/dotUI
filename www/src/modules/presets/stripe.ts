import { definePreset } from "./preset"

export const stripe = definePreset({
  id: "stripe",
  name: "Stripe",
  description: "Blurple fills, cool slate hairlines.",
  swatch: "#675dff",
  inspiredBy: "Stripe",
  diff: {
    // Color
    brand: "#533afd",
    // Checks, radios and switches fill one step lighter (form accent).
    selectionSeed: "#675dff",
    preserveSeed: true,
    // Slate text #1A2C44, border #D4DEE9.
    neutralHue: 256,
    neutralTint: 2,
    successSeed: "#2b8700",
    warningSeed: "#cc4b00",
    dangerSeed: "#e61947",
    lightBg: 100,
    // Dark page #14171d.
    darkBg: 7.5,

    // Surfaces
    // The sidebar sits on the white page; only hover paints primary-25.
    shellTone: "page",

    // Typography
    // Sail's base stack is the OS face.
    bodyFont: "System",
    monoFont: "Source Code Pro",
    // Visual Refresh 13px; 14 would also lift the 12px badge/caption tier.
    uiTextSize: "13",
    labelWeight: "semibold",
    titleStyle: "bold",

    // Icons
    // Sail's 1.5/16 line on Lucide's 24 grid.
    iconStroke: 2.25,

    // Shape
    // Ladder at 8: badges 4, controls 6, popovers and dialogs 8.
    radiusPx: 8,
    roleItem: "sm",
    rolePanel: "lg",
    roleCard: "lg",

    // Space
    // 28px controls.
    density: "compact",

    // Browser
    selectionHighlight: "browser",
    cursorDisabled: "default",

    // States
    // 0 0 0 4px at 36%.
    focusStyle: "halo",
    focusStrength: "faint",
    focusWidth: 4,
    focusInputStyle: "ring",
    disabledTreatment: "fade",

    // Motion
    motion: "smooth",

    // Components
    buttonSecondary: "outline",
    toggleSelected: "tint",
    segmentedSelected: "ring",
    cardSelected: "outline",
    inputHover: "edge",
    fieldLabel: "semibold",
    inputError: "icon-message",
    pickerCaret: "double",
    calendarDayShape: "circle",
    calendarToday: "numeral",
    calendarWeekdays: "double",
    menuArrows: "none",
    // 32px rows under 28px controls.
    menuRows: "step",
    dialogBackdrop: "wash",
    // rgba(186,200,218,.7).
    dialogBackdropStrength: "heavy",
    dialogSections: "on-scroll",
    mobileDialogs: "sheet",
    tooltipStyle: "surface",
    // Slate-800 toasts; only errors go solid red (Bold would paint every status).
    toastStyle: "inverse",
    tabStyle: "line",
    tabsColor: "accent",
    // The current sidebar item is blurple ink, no fill.
    navMarker: "ink",
    navWeight: "semibold",
    navItemWeight: "regular-semibold",
    accordionMarker: "leading-caret",
    breadcrumbTone: "link",
    badgeStyle: "soft-outline",
    badgeShape: "rounded",
    kbdTreatment: "outline",
    avatarShape: "rounded",
    tableHeaderLabel: "strong",
    // Sail's categorical series: #9966FF, #0055BC, #00A1C2, #ED6804…
    chartPalette: "vivid",
  },
})

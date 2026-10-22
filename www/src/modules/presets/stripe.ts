import { definePreset } from "./preset"

export const stripe = definePreset({
  id: "stripe",
  name: "Stripe",
  description: "Blurple fills, cool slate hairlines.",
  swatch: "#675dff",
  inspiredBy: "Stripe",
  diff: {
    // Assets
    brandAssets: "stripe",

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
    // The Dashboard has no dark mode. Derived from Sail's dark palette in the
    // login bundle: page #14171d.
    darkBg: 7.5,

    // Surfaces
    // The sidebar sits on the white page; only hover paints primary-25.
    shellTone: "page",

    // Typography
    // Sail's base stack is the OS face.
    bodyFont: "System",
    monoFont: "Source Code Pro",
    // Sail's control text is 14/20. Stand-in: compact's caption rung moves
    // with it, so 12px badges and helper text render at 14.
    uiTextSize: "14",
    labelWeight: "semibold",
    titleStyle: "bold",

    // Icons
    // Sail's 1.5/16 line on Lucide's 24 grid.
    iconStroke: 2.25,

    // Shape
    // Ladder at 8: badges 4, controls and cards 6, popovers and dialogs 8.
    radiusPx: 8,
    roleItem: "sm",
    rolePanel: "lg",
    roleCard: "md",

    // Space
    // 28px controls.
    density: "compact",

    // Browser
    selectionHighlight: "browser",
    cursorDisabled: "default",

    // States
    // 3px past the 1px edge, at 36%. Stand-in: the ring is the brand, Sail's is
    // sky blue (rgba(1,150,237,.36)) on buttons and fields, and focused fields
    // keep their slate edge.
    focusStyle: "halo",
    focusStrength: "faint",
    focusWidth: 3,
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
    // Banners: a status tint inside a status edge. Stand-in: Sail sets the
    // text in the status ink and keeps the neutral banner white.
    alertStyle: "soft-outline",
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
    avatarShape: "rounded",
    tableHeaderLabel: "strong",
    // Sail's categorical series: #9966FF, #0055BC, #00A1C2, #ED6804…
    chartPalette: "vivid",
    chartAxes: "labeled",
    chartLines: "fine",
    chartBars: "slim",
    chartLegend: "top",
  },
})

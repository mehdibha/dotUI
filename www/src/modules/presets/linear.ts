import { DEFAULT_MOTION, definePreset } from "./preset"

export const linear = definePreset({
  id: "linear",
  name: "Linear",
  description: "Indigo on near-black, pill actions.",
  swatch: "#828fff",
  inspiredBy: "Linear",
  state: {
    // Color
    brand: "#5e6ad2",
    buttonColor: "accent",
    selectionColor: "accent",
    neutralHue: 262,
    successSeed: "#27a644",
    warningSeed: "",
    dangerSeed: "#eb5757",
    selectionSeed: "",
    vividness: 1,
    neutralTint: 1,
    preserveSeed: false,
    lightBg: 99,
    // Linear's dark-first page is near-black #08090a.
    darkBg: 2,

    // Typography
    headingFont: "",
    bodyFont: "Inter",
    monoFont: "Geist Mono",

    // Icons
    iconLibrary: "lucide",
    iconStroke: 2,
    iconWeight: "regular",

    // Shape
    radiusPx: 8,
    roleControl: "md",
    roleItem: "auto",
    roleSurface: "lg",
    rolePanel: "xl",
    roleCard: "xl",

    // Space
    density: "default",
    spacingUnit: 4,

    // Surfaces
    surfaceLayers: "same",
    surfaceEdge: "line",
    surfaceShadow: "low",
    surfaceGlass: false,

    // Browser
    // The app's --pointer is default.
    cursorControls: "default",
    cursorPending: "default",
    cursorDragging: "inherit",
    cursorDisabled: "default",
    selectionUiText: "none",
    selectionHighlight: "accent",

    // States
    focusColor: "accent",
    focusStyle: "ring",
    focusWidth: 1,
    focusOffset: "gap",
    focusGap: 2,
    focusHaloStrength: 45,
    focusInputStyle: "border",
    focusInputWidth: 2,
    focusInputStrength: 30,
    focusInputBorderWidth: 1,
    disabledTreatment: "fade",
    inputError: "border",

    // Motion
    ...DEFAULT_MOTION,

    // Mobile
    mobilePickers: "sheet",
    mobileDialogs: "center",

    // Components
    chartPalette: "mono",
    chartGrid: "solid",
    linkUnderline: "never",
    linkColor: "accent",
    skeletonAnimation: "shimmer",
    spinnerStyle: "ring",
    progressTrack: "thin",
    progressIndeterminate: "slide",
    progressGap: false,
    buttonStyle: "flat",
    // Every app button computes 9999px.
    buttonRadius: "pill",
    groupSeparator: "auto",
    toggleSelected: "fill",
    segmentedSelected: "flat",
    segmentedTrack: "filled",
    switchColor: "accent",
    checkboxColor: "accent",
    checkCorner: "rounded",
    radioColor: "accent",
    cardSelected: "tint",
    cardControl: "start",
    inputStyle: "outline",
    inputHover: "border",
    addonLayout: "inside",
    addonDivider: "hairline",
    numberLayout: "right",
    otpStyle: "group",
    pickerCaret: "chevron",
    calendarDayShape: "rounded",
    calendarToday: "none",
    calendarWeekdays: "single",
    sliderThumb: "circle",
    sliderTrack: "thin",
    sliderColor: "accent",
    menuIndicator: "check-end",
    menuHighlight: "neutral",
    menuInset: "inset",
    menuLabels: "sentence",
    menuSearch: "prompt",
    menuScale: "default",
    dialogBackdrop: "dim",
    dialogPosition: "top",
    popoverTip: "none",
    popoverHeader: "title",
    tooltipStyle: "surface",
    tabStyle: "pill",
    tabsColor: "neutral",
    accordionContainer: "divided",
    accordionMarker: "chevron",
    accordionMarkerPosition: "trailing",
    breadcrumbSeparator: "chevron",
    breadcrumbTone: "muted",
    paginationCurrent: "outline",
    badgeStyle: "outline",
    badgeShape: "pill",
    kbdTreatment: "chip",
    avatarShape: "circle",
    avatarFallback: "neutral",
    tableSeparation: "lines",
    tableHeader: "plain",
  },
})

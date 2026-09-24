import { definePreset } from "./preset"

export const spotify = definePreset({
  id: "spotify",
  name: "Spotify",
  description: "Vivid green on near-black.",
  swatch: "#1ed760",
  inspiredBy: "Spotify",
  state: {
    // Color
    brand: "#1ed760",
    buttonColor: "accent",
    selectionColor: "accent",
    neutralHue: null,
    successSeed: "#1ed760",
    warningSeed: "#ffa42b",
    dangerSeed: "#e91429",
    selectionSeed: "",
    vividness: 1,
    neutralTint: 0,
    preserveSeed: true,

    // Typography
    headingFont: "",
    // Circular is proprietary; Figtree is the closest free geometric.
    bodyFont: "Figtree",
    monoFont: "Geist Mono",

    // Icons
    iconLibrary: "lucide",
    iconStroke: 2,
    iconWeight: "regular",

    // Shape
    radiusPx: 8,
    roleControl: "full",
    roleItem: "auto",
    roleSurface: "lg",
    rolePanel: "lg",

    // Space
    // Live controls are 32/48px; comfortable is the closest tier.
    density: "comfortable",
    spacingUnit: 4,

    // Surfaces
    surfaceStrategy: "tonal",
    surfaceDepth: "subtle",
    surfaceCanvas: "same",
    surfaceMaterial: "solid",
    lightBg: 100,
    darkBg: 5.5,

    // Browser
    cursorControls: "pointer",
    cursorPending: "default",
    cursorDragging: "inherit",
    cursorDisabled: "not-allowed",
    selectionUiText: "none",
    selectionHighlight: "browser",
    scrollbarStyle: "overlay",

    // States
    focusColor: "neutral",
    // An inset ring measured ~1.1:1 on the fills; duo stands in.
    focusStyle: "duo",
    focusWidth: 2,
    focusOffset: "gap",
    focusGap: 2,
    focusHaloStrength: 45,
    focusInputStyle: "ring",
    focusInputWidth: 2,
    focusInputStrength: 30,
    focusInputBorderWidth: 1,
    disabledTreatment: "fade",
    inputError: "border",

    // Motion
    motionCharacter: "standard",
    motionSpeed: 1.25,
    motionOverlay: "slide",
    motionState: "smooth",

    // Mobile
    mobilePickers: "drawer",
    mobileDialogs: "center",

    // Components
    chartPalette: "mono",
    chartGrid: "solid",
    linkUnderline: "hover",
    linkColor: "neutral",
    skeletonAnimation: "shimmer",
    spinnerStyle: "ring",
    progressTrack: "thin",
    progressIndeterminate: "slide",
    progressGap: false,
    buttonStyle: "flat",
    buttonRadius: "pill",
    buttonHover: "lighten",
    buttonPress: "dim",
    groupSeparator: "auto",
    toggleSelected: "inverse",
    segmentedSelected: "flat",
    segmentedTrack: "filled",
    switchColor: "accent",
    checkboxColor: "accent",
    checkCorner: "rounded",
    radioColor: "accent",
    cardSelected: "tint",
    cardControl: "start",
    inputStyle: "filled",
    inputHover: "tint",
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
    sliderColor: "neutral",
    menuIndicator: "check-end",
    menuHighlight: "neutral",
    menuInset: "inset",
    menuLabels: "sentence",
    menuSearch: "field",
    menuScale: "default",
    dialogBackdrop: "dim",
    dialogPosition: "center",
    popoverTip: "none",
    popoverHeader: "title",
    tooltipStyle: "surface",
    tabStyle: "line",
    // Accent would turn the tab label green.
    tabsColor: "neutral",
    accordionContainer: "divided",
    accordionMarker: "chevron",
    accordionMarkerPosition: "trailing",
    breadcrumbSeparator: "chevron",
    breadcrumbTone: "muted",
    paginationCurrent: "outline",
    badgeStyle: "soft",
    badgeShape: "rounded",
    kbdTreatment: "chip",
    avatarShape: "circle",
    avatarFallback: "neutral",
    tableSeparation: "lines",
    tableHeader: "plain",
  },
})

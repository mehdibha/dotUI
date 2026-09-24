import { definePreset } from "./preset"

export const claude = definePreset({
  id: "claude",
  name: "Claude",
  description: "Ink actions, clay highlights.",
  swatch: "#d97757",
  inspiredBy: "Claude",
  state: {
    // Color
    brand: "#d97757",
    // The live primary is ink; clay is never the default fill.
    buttonColor: "neutral",
    selectionColor: "neutral",
    neutralHue: 96,
    // Auto: Claude's #009300 sits at the danger red's L and trips the CVD gate.
    successSeed: "",
    warningSeed: "#fab219",
    dangerSeed: "#d03b3b",
    selectionSeed: "#2a78d6",
    vividness: 1,
    neutralTint: 1,
    preserveSeed: false,

    // Typography
    // Free stand-ins for Anthropic Serif and Sans.
    headingFont: "Source Serif 4",
    bodyFont: "Inter",
    monoFont: "Geist Mono",

    // Icons
    // platform.claude.com draws on Phosphor's 256 grid.
    iconLibrary: "phosphor",
    iconStroke: 2,
    iconWeight: "regular",

    // Shape
    radiusPx: 10.67,
    roleControl: "md",
    roleItem: "auto",
    roleSurface: "lg",
    rolePanel: "xl",

    // Space
    density: "default",
    spacingUnit: 4,

    // Surfaces
    surfaceStrategy: "hairline",
    surfaceDepth: "raised",
    surfaceCanvas: "same",
    surfaceMaterial: "solid",
    lightBg: 99,
    darkBg: 7,

    // Browser
    cursorControls: "pointer",
    cursorPending: "default",
    cursorDragging: "inherit",
    cursorDisabled: "not-allowed",
    selectionUiText: "none",
    selectionHighlight: "accent",
    scrollbarStyle: "native",

    // States
    focusColor: "accent",
    focusStyle: "duo",
    focusWidth: 1,
    focusOffset: "gap",
    focusGap: 2,
    focusHaloStrength: 45,
    focusInputStyle: "ring",
    focusInputWidth: 2,
    focusInputStrength: 30,
    focusInputBorderWidth: 1,
    disabledTreatment: "solid",
    inputError: "border",

    // Motion
    motionCharacter: "standard",
    motionSpeed: 1,
    motionOverlay: "scale",
    motionState: "quick",

    // Mobile
    mobilePickers: "drawer",
    mobileDialogs: "center",

    // Components
    chartPalette: "mono",
    chartGrid: "solid",
    linkUnderline: "always",
    linkColor: "neutral",
    skeletonAnimation: "shimmer",
    spinnerStyle: "ring",
    progressTrack: "thin",
    progressIndeterminate: "slide",
    progressGap: false,
    buttonStyle: "flat",
    buttonRadius: "auto",
    buttonHover: "dim",
    buttonPress: "scale",
    groupSeparator: "auto",
    toggleSelected: "fill",
    segmentedSelected: "flat",
    segmentedTrack: "filled",
    switchColor: "neutral",
    checkboxColor: "neutral",
    checkCorner: "rounded",
    radioColor: "neutral",
    cardSelected: "tint",
    cardControl: "start",
    inputStyle: "outline",
    inputHover: "none",
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
    tooltipStyle: "inverted",
    tabStyle: "line",
    tabsColor: "accent",
    accordionContainer: "divided",
    accordionMarker: "chevron",
    accordionMarkerPosition: "trailing",
    breadcrumbSeparator: "chevron",
    breadcrumbTone: "muted",
    paginationCurrent: "outline",
    badgeStyle: "soft",
    badgeShape: "pill",
    kbdTreatment: "chip",
    avatarShape: "circle",
    avatarFallback: "neutral",
    tableSeparation: "lines",
    tableHeader: "plain",
  },
})

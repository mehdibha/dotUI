import { definePreset } from "./preset"

export const polaris = definePreset({
  id: "polaris",
  name: "Polaris",
  description: "Charcoal bevels on grouped gray, dense and blue-linked.",
  swatch: "#303030",
  inspiredBy: "Shopify Polaris",
  diff: {
    // Color
    // Blue #005bd3 is emphasis only: links and focus. Fills are charcoal.
    brand: "#005bd3",
    preserveSeed: true,
    buttonColor: "neutral",
    selectionColor: "neutral",
    checkboxColor: "neutral",
    radioColor: "neutral",
    switchColor: "neutral",
    sliderColor: "neutral",
    successSeed: "#047b5d",
    warningSeed: "#ffb800",
    dangerSeed: "#c70a24",
    neutralTint: 0,
    // The #f1f1f1 page is L* 95.
    lightBg: 95,
    // The dark-experimental #1a1a1a page; Shopify ships no production dark.
    darkBg: 9.5,
    // Fields and checks sit on a #8a8a8a edge.
    controlEdge: "strong",

    // Typography
    bodyFont: "Inter",
    monoFont: "System Mono",
    uiTextSize: "13",
    titleStyle: "compact",

    // Icons
    // Polaris Icons are Shopify-only; Lucide stands in.
    iconStroke: 1.75,

    // Shape
    // 8 / 12 / 16: controls and rows, popovers and cards, modals.
    radiusPx: 8,
    roleControl: "lg",
    roleSurface: "xl",
    rolePanel: "2xl",
    density: "compact",

    // Surfaces
    // White cards on the gray page, rimmed by ShadowBevel instead of a border.
    surfaceLayers: "grouped",
    surfaceEdge: "bevel",
    surfaceShadow: "low",
    // The #ebebeb sidebar around the admin's page.
    shellTone: "recessed",

    // Browser
    selectionHighlight: "browser",
    cursorDisabled: "default",

    // States
    focusInputStyle: "ring",
    invalidStyle: "tint",

    // Motion
    motionEntrance: "slide",

    // Buttons
    buttonStyle: "bevel",
    // ButtonGroup segmented: attached outlined buttons, #ccc pressed segment.
    segmentedSelected: "tone",
    segmentedTrack: "outline",

    // Inputs: a flat #fdfdfd field, 32px beside 28px buttons.
    inputStyle: "outline",
    inputHover: "edge-tint",
    inputHeight: "step",
    inputError: "icon-message",
    selectTrigger: "field",
    pickerCaret: "double",
    numberLayout: "stacked-inset",

    // Selection
    sliderThumb: "solid",
    switchStyle: "outlined",

    // Menus & popovers
    tooltipStyle: "surface",
    menuSelectedRow: "tint",
    menuRows: "step",
    mobilePickers: "anchored",

    // Dialogs
    dialogSections: "header-band",
    dialogBackdrop: "scrim",
    dialogEntrance: "rise",
    mobileDialogs: "sheet",

    // Navigation
    tabStyle: "pill",
    navMarker: "surface",
    // Tabs stay 550; sidebar items step 550 → 650 when current.
    navItemWeight: "medium-semibold",
    linkUnderline: "always",

    // Feedback
    // The in-card banner; the page banner's solid header strip has no option.
    alertStyle: "soft",
    badgeStyle: "soft",
    badgeShape: "rounded",
    // Black toasts; only the error toast turns solid red, so status stays an icon.
    toastStyle: "inverse",
    progressTrack: "x-heavy",
    // ProgressBar is info-blue by default, not charcoal.
    progressColor: "accent",
    skeletonAnimation: "none",

    // Data display
    tableHeader: "filled",
    avatarShape: "rounded",
    calendarToday: "numeral",
    calendarWeekdays: "double",
  },
})

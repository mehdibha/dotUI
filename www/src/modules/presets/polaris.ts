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
    checkboxColor: "neutral",
    radioColor: "neutral",
    switchColor: "neutral",
    sliderColor: "neutral",
    successSeed: "#047b5d",
    warningSeed: "#ffb800",
    dangerSeed: "#c70a24",
    neutralTint: 0,
    // Fields and checks sit on a #8a8a8a edge.
    controlEdge: "strong",

    // Typography
    bodyFont: "Inter",
    monoFont: "System Mono",
    uiTextSize: "13",
    titleStyle: "compact",

    // Icons
    iconStroke: 1.75,

    // Shape
    // 8 / 12 / 16: controls and rows, popovers and cards, modals.
    radiusPx: 8,
    roleControl: "lg",
    roleSurface: "xl",
    rolePanel: "2xl",
    density: "compact",

    // Surfaces
    // Borderless white cards lifted off a #f1f1f1 page.
    surfaceLayers: "grouped",
    surfaceEdge: "none",
    surfaceShadow: "low",
    // The #ebebeb sidebar around the admin's white page.
    shellTone: "recessed",

    // States
    focusInputStyle: "ring",
    invalidStyle: "tint",
    cursorDisabled: "default",

    // Motion
    motionEntrance: "slide",

    // Buttons
    buttonStyle: "bevel",

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
    sliderTrack: "thin",
    switchStyle: "outlined",

    // Menus & popovers
    tooltipStyle: "surface",
    menuSelectedRow: "tint",
    menuRows: "step",

    // Dialogs
    dialogSections: "header-band",
    dialogBackdrop: "scrim",
    dialogEntrance: "rise",
    mobileDialogs: "sheet",

    // Navigation
    tabStyle: "pill",
    navMarker: "surface",
    navWeight: "medium-semibold",
    linkUnderline: "always",

    // Feedback
    badgeStyle: "soft",
    badgeShape: "rounded",
    toastStyle: "inverse",
    toastStatus: "bold",
    progressTrack: "x-heavy",
    skeletonAnimation: "none",

    // Data display
    tableHeader: "filled",
    avatarShape: "rounded",
    calendarToday: "numeral",
    calendarWeekdays: "double",
  },
})

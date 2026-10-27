import { definePreset } from "./preset"

export const polaris = definePreset({
  id: "polaris",
  name: "Polaris",
  description: "Charcoal pills on white, soft-shadowed cards, dense.",
  swatch: "#101010",
  inspiredBy: "Shopify Polaris",
  diff: {
    // Assets
    brandAssets: "shopify",

    // Style: the 2026 Admin dropped the bevels. Charcoal primaries keep a
    // soft drop; secondaries are flat #ebebeb pills.
    buttonSecondary: "soft",

    // Color
    // Link blue #0048e3; fills are charcoal.
    brand: "#0048e3",
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
    // Status tints lean vivid: the Admin's badges are #aafb6a and #ffe332,
    // its info banner #cdf7ff.
    vividness: 1.2,
    // A white page; cards sit on it, set apart by shadow.
    lightBg: 100,
    // The dark-experimental #1a1a1a page; Shopify ships no production dark.
    darkBg: 9.5,

    // Typography
    bodyFont: "Inter",
    monoFont: "System Mono",

    // Icons
    // Polaris Icons are Shopify-only; Lucide stands in.
    iconStroke: 1.75,

    // Shape
    // Fields and rows 12px, cards and banners 20px (popovers are 16px).
    radiusPx: 13,
    roleControl: "lg",
    roleSurface: "xl",
    roleCard: "xl",
    // Compact's 12px control text matches buttons and tabs.
    // Stand-in: fields, menu rows and nav rows are 13px in Polaris.
    density: "compact",

    // Surfaces
    // White cards on the white page, a 2px rim shadow and no border.
    surfaceEdge: "none",
    surfaceShadow: "low",

    // Browser
    selectionHighlight: "browser",
    cursorDisabled: "default",

    // States
    // Focus #457fff, lighter than the link blue.
    focusColor: "custom",
    focusCustomColor: "#457fff",
    invalidStyle: "tint",

    // Motion
    popoverEntrance: "slide",
    tooltipEntrance: "slide",

    // Buttons
    // --p-border-radius-action is 9999px.
    buttonRadius: "pill",
    segmentedSelected: "tone",
    segmentedTrack: "outline",

    // Inputs: 30–32px fields beside 28px buttons.
    inputHover: "edge-tint",
    inputHeight: "step",
    inputError: "icon-message",
    fieldLabel: "medium",
    selectTrigger: "field",
    pickerCaret: "double",
    numberLayout: "stacked-inset",

    // Selection
    sliderThumb: "solid",
    switchStyle: "outlined",

    // Menus & popovers
    menuSelectedRow: "tint",
    // 32px rows under 28px buttons.
    menuRows: "step",
    mobilePickers: "anchored",

    // Dialogs
    dialogSections: "header-band",
    dialogBackdrop: "scrim",
    dialogEntrance: "rise",
    mobileDialogs: "sheet",

    // Navigation
    tabStyle: "pill",
    navItemWeight: "regular",
    linkUnderline: "always",
    // Links in text are ink, underlined; only metric links stay blue.
    linkColor: "neutral",

    // Feedback
    alertStyle: "soft",
    badgeStyle: "soft",
    toastStyle: "inverse",
    progressTrack: "x-heavy",
    // Stand-in: ProgressBar fills info blue #91d0ff, lighter than the brand.
    progressColor: "accent",
    skeletonAnimation: "none",

    // Data display
    tableHeader: "filled",
    avatarShape: "rounded",
    calendarToday: "numeral",
    calendarWeekdays: "double",
  },
})

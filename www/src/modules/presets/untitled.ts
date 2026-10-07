import { definePreset } from "./preset"

export const untitled = definePreset({
  id: "untitled",
  name: "Untitled",
  description: "Purple on pure neutrals, rim-lit buttons and raised fields.",
  swatch: "#7f56d9",
  inspiredBy: "Untitled UI",
  diff: {
    // Color: v8 grays are Tailwind neutral (chroma 0).
    brand: "#7f56d9",
    preserveSeed: true,
    successSeed: "#00a63e",
    warningSeed: "#d08700",
    dangerSeed: "#e7000b",
    neutralTint: 0,
    lightBg: 100,
    // #0a0a0a, L* 2.7.
    darkBg: 2.5,
    selectionHighlight: "browser",

    // Typography
    bodyFont: "Inter",
    // ui-monospace first.
    monoFont: "System Mono",
    // 600 on buttons and toggles.
    labelWeight: "semibold",
    // 600 titles; the -2% tracking starts only at 36px.
    titleStyle: "compact",
    // 16px field values beside 14px controls.
    fieldTextSize: "large",

    // Shape: 8px controls, 12px cards, 16px modals.
    radiusPx: 8,
    roleControl: "lg",
    roleItem: "md",
    rolePanel: "2xl",
    roleCard: "xl",
    density: "comfortable",

    // Surfaces: a white sidebar beside the white page, split by a hairline.
    surfaceShadow: "low",
    shellTone: "page",

    // States: focus thickens the edge to 2px brand, no halo.
    focusInputStyle: "border",
    focusInputWeight: "thick",
    disabledTreatment: "fade",

    // Motion: menus fade with a 2px nudge.
    motionEntrance: "fade",
    chartMotion: "ease",

    // Buttons: Rim light's Auto field is the raised field.
    buttonStyle: "rim-light",
    segmentedSelected: "raised",
    // A #fafafa track read by its hairline: nearer Outline than Filled.
    segmentedTrack: "outline",
    paginationCurrent: "selected",

    // Inputs: 36px buttons beside 40px fields.
    inputHeight: "step",
    fieldLabel: "medium",
    inputError: "icon-field",
    selectTrigger: "field",
    numberLayout: "stacked-cells",
    otpStyle: "separate",

    // Selection: 24px ringed thumb on an 8px track.
    sliderThumb: "ring",
    sliderTrack: "medium",
    cardSelected: "outline",

    // Menus & popovers
    menuArrows: "none",
    menuSelectedRow: "tint",
    // Dropdown rows 38px, select and palette rows 40px.
    menuRows: "step",
    menuSearch: "bar",
    mobilePickers: "anchored",

    // Dialogs: neutral-950 at 70% with a 6px blur.
    dialogBackdropStrength: "heavy",
    mobileDialogs: "sheet",

    // Navigation: tabs and nav items 600; the pill tab is brand-50 / brand-700.
    navWeight: "semibold",
    tabsPill: "tint",
    linkUnderline: "hover",

    // Feedback
    spinnerStyle: "ring-track",
    progressTrack: "thick",
    skeletonAnimation: "pulse",

    // Data display
    // 50 fill, 700 label, 200 ring.
    badgeStyle: "soft-outline",
    tableHeader: "filled",
    kbdTreatment: "outline",
    cardFooter: "rule",
    calendarDayShape: "circle",
    calendarWeekdays: "double",
  },
})

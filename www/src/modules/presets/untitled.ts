import { definePreset } from "./preset"

export const untitled = definePreset({
  id: "untitled",
  name: "Untitled",
  description: "Purple on pure neutrals, rim-lit buttons and raised fields.",
  swatch: "#7f56d9",
  inspiredBy: "Untitled UI",
  diff: {
    // Color
    brand: "#7f56d9",
    preserveSeed: true,
    successSeed: "#00a63e",
    warningSeed: "#d08700",
    dangerSeed: "#e7000b",
    neutralTint: 0,
    lightBg: 100,
    selectionHighlight: "browser",

    // Typography: 600 labels on buttons, tabs, rows and nav items.
    bodyFont: "Inter",
    labelWeight: "semibold",
    titleStyle: "tight",
    // 16px field values beside 14px controls.
    fieldTextSize: "large",

    // Shape: 8px controls, 12px cards, 16px modals.
    radiusPx: 8,
    roleControl: "lg",
    roleItem: "md",
    rolePanel: "2xl",
    roleCard: "xl",
    density: "comfortable",

    // Surfaces
    surfaceShadow: "low",

    // States: focus thickens the edge to 2px brand, no halo.
    focusInputStyle: "border",
    focusInputWeight: "thick",
    disabledTreatment: "fade",

    // Motion
    motionEntrance: "fade",

    // Buttons: Rim light's Auto field is the raised field.
    buttonStyle: "rim-light",
    segmentedSelected: "raised",
    paginationCurrent: "selected",

    // Inputs: 36px buttons beside 40px fields.
    inputHeight: "step",
    fieldLabel: "medium",
    inputError: "icon-field",
    selectTrigger: "field",
    numberLayout: "stacked-cells",
    otpStyle: "separate",

    // Selection
    sliderThumb: "ring",
    sliderTrack: "medium",
    cardSelected: "outline",

    // Menus & popovers
    menuArrows: "none",
    menuSelectedRow: "tint",
    mobilePickers: "anchored",

    // Dialogs: neutral-950 at 70% with a 6px blur.
    dialogBackdropStrength: "heavy",
  },
})

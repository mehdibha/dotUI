import { definePreset } from "./preset"

export const material3 = definePreset({
  id: "material3",
  name: "Material 3",
  description: "Purple on tonal lavender, pill actions and filled fields.",
  swatch: "#6750a4",
  inspiredBy: "Material 3",
  diff: {
    // Color
    brand: "#6750a4",
    preserveSeed: true,
    dangerSeed: "#b3261e",
    // Neutrals carry the brand hue (chroma ~.015 at 298–315).
    neutralHue: 305,
    neutralTint: 2,
    lightBg: 98,
    darkBg: 6,
    selectedWash: "brand",

    // Typography
    bodyFont: "Roboto",
    monoFont: "Roboto Mono",
    titleStyle: "display",

    // Icons: Material Symbols is a separate set; Remix is the closest line set.
    iconLibrary: "remix",

    // Shape
    // 4px fields and menus, 12px cards, 28px dialogs, pill buttons.
    radiusPx: 8,
    roleControl: "sm",
    roleItem: "none",
    roleSurface: "sm",
    rolePanel: "3xl",
    roleCard: "xl",
    density: "comfortable",

    // Surfaces: tone separates layers, not hairlines; menus keep a level-2 shadow.
    surfaceLayers: "tonal",
    surfaceEdge: "none",
    surfaceShadow: "low",

    // States
    focusWidth: 3,
    focusInputStyle: "border",
    focusInputWeight: "thick",
    cursorDisabled: "default",

    // Motion
    motion: "expressive",
    motionEntrance: "slide",

    // Buttons
    buttonSecondary: "tonal",
    buttonRadius: "pill",
    toggleSelected: "solid",
    segmentedSelected: "tone",
    segmentedTrack: "outline",

    // Inputs: the 56dp filled field with a bottom indicator.
    inputStyle: "indicator",
    inputHeight: "tall",
    inputError: "icon-field",
    selectTrigger: "field",
    // The indicator's bottom lines would merge in attached cells.
    otpStyle: "separate",

    // Selection
    checkCorner: "sharp",
    radioMark: "ring",
    switchStyle: "outlined",
    sliderThumb: "handle",
    sliderTrack: "thick",

    // Menus & popovers: full-bleed rows, no check, a tinted selected row.
    menuInset: "full-bleed",
    menuArrows: "none",
    menuIndicator: "none",
    menuSelectedRow: "tint",
    menuRows: "step",
    mobilePickers: "anchored",

    // Dialogs: a 32% scrim; dividers only while scrolling.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "light",
    dialogSections: "on-scroll",
    dialogEntrance: "drop",

    // Navigation
    tabStyle: "line",
    tabsColor: "accent",

    // Feedback
    badgeStyle: "outline",
    badgeShape: "rounded",
    toastStyle: "inverse",
    progressTrackStyle: "gap",

    // Date & time
    calendarDayShape: "circle",
    calendarToday: "ring",
    calendarTodayColor: "selection",
  },
})

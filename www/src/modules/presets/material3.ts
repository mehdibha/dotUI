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
    // surface #fef7ff (tone 98) and #141218 (tone 6).
    lightBg: 98,
    darkBg: 6,
    // outline #79747e on fields and buttons, #49454f on checks.
    controlEdge: "strong",
    // secondary-container #e8def8 behind selected rows and chips.
    selectedWash: "brand",

    // Typography
    bodyFont: "Roboto",
    monoFont: "Roboto Mono",
    titleStyle: "display",
    // Field values are body-large 16px beside 14px labels.
    fieldTextSize: "large",

    // Icons
    iconLibrary: "material-symbols",

    // Shape
    // 4.5px fields, field tops and menus, 13.5px cards, 27px dialogs (4 / 12 / 28), pill buttons.
    radiusPx: 9,
    roleItem: "none",
    roleSurface: "sm",
    rolePanel: "3xl",
    roleCard: "xl",
    // 40dp buttons, 56dp fields, 48dp menu rows.
    density: "spacious",

    // Surfaces: tone separates layers, not hairlines; menus keep a level-2 shadow.
    surfaceLayers: "tonal",
    surfaceEdge: "none",
    surfaceShadow: "low",
    // The nav rail sits a tone below borderless content panels.
    shellTone: "recessed",

    // States
    // 3px ring; M3's is secondary #625b71, but Neutral would grey field focus too.
    focusWidth: 3,
    focusInputStyle: "border",
    focusInputWeight: "thick",
    cursorDisabled: "default",

    // Selection: M3 leaves ::selection to the browser.
    selectionHighlight: "browser",

    // Motion
    motion: "expressive",
    motionEntrance: "slide",

    // Buttons
    buttonSecondary: "tonal",
    buttonRadius: "pill",
    toggleSelected: "solid",
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

    // Menus & popovers: full-bleed rows, no check, a tinted selected row.
    menuInset: "full-bleed",
    menuArrows: "none",
    menuIndicator: "none",
    menuSelectedRow: "tint",
    menuRows: "step",
    mobilePickers: "anchored",
    // The docked search view: a bare input over a divider.
    menuSearch: "bar",

    // Dialogs: a 32% black scrim; dividers only while scrolling.
    dialogBackdrop: "scrim",
    dialogSections: "on-scroll",
    dialogEntrance: "drop",

    // Navigation: primary tabs' label indicator; the drawer's stadium marker.
    tabStyle: "line",
    tabsColor: "accent",
    tabIndicator: "label",
    navMarker: "pill",

    // Feedback
    // Chips: 1px #79747e outline, 8px corners.
    badgeStyle: "outline",
    badgeShape: "rounded",
    toastStyle: "inverse",
    progressTrackStyle: "gap",

    // Display
    // Avatars sit on primary-container.
    avatarFallback: "accent",

    // Date & time
    calendarDayShape: "circle",
    calendarToday: "ring",
    calendarTodayColor: "selection",
  },
})

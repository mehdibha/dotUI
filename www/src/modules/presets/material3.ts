import { definePreset } from "./preset"

export const material3 = definePreset({
  id: "material3",
  name: "Material 3",
  description: "Purple on tonal lavender, pill actions and filled fields.",
  swatch: "#6750a4",
  inspiredBy: "Material 3",
  diff: {
    // Assets
    brandAssets: "material",

    // Style: tone separates layers, not hairlines; menus keep a level-2 shadow.
    // Control edges at the darkest step, for M3's #79747e outline and the
    // #49454f field and check lines.
    style: "tonal",
    controlEdge: "strong",

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
    // Field tops 4.5px, menu rows 4.5px, cards 13.5px, menus 18px, dialogs
    // 27px (M3: 4 / 4 / 12 / 16 / 28), pill buttons. Tooltips and snackbars
    // land on 6.75px for M3's 4.
    radiusPx: 9,
    roleItem: "sm",
    roleSurface: "2xl",
    rolePanel: "3xl",
    roleCard: "xl",
    // 40dp buttons, 56dp fields, 48dp menu rows.
    density: "spacious",

    // Surfaces
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
    popoverEntrance: "slide",
    tooltipEntrance: "slide",

    // Buttons
    toggleSelected: "solid",
    buttonRadius: "pill",
    // The chip follows the button style, not Tonal's inverse one.
    segmentedSelected: "auto",
    segmentedTrack: "outline",

    // Inputs: the 56dp filled field with a bottom indicator.
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

    // Menus & popovers: the vertical menu's rows sit 4px in from the edge, no
    // check, a tinted selected row.
    menuSelectedRow: "tint",
    menuArrows: "none",
    menuIndicator: "none",
    menuRows: "step",
    mobilePickers: "anchored",
    // The docked search view: a bare input over a divider, 16px query and
    // rows (body-large).
    menuSearch: "bar",
    menuScale: "large",

    // Dialogs: a 32% black scrim; dividers only while scrolling.
    dialogBackdrop: "scrim",
    dialogSections: "on-scroll",
    dialogEntrance: "drop",

    // Navigation: primary tabs' label indicator; the drawer's stadium marker.
    tabStyle: "line",
    tabsColor: "accent",
    tabIndicator: "label",
    navMarker: "pill",
    // Drawer labels 500, 700 when active (600 is the nearest step).
    navItemWeight: "medium-semibold",

    // Feedback
    toastStyle: "inverse",
    // Chips: a 1px #cac4d0 outline. Stand-in: 4.5px corners for their 8px.
    badgeStyle: "outline",
    badgeShape: "rounded",
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

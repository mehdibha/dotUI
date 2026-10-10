import { definePreset } from "./preset"

export const airbnb = definePreset({
  id: "airbnb",
  name: "Airbnb",
  description: "Rausch CTAs, ink selection, big soft targets.",
  swatch: "#ff385c",
  inspiredBy: "Airbnb",
  diff: {
    // Style
    // Popovers drop 0 2px 16px .12 while bordered tiles stay hairline. The
    // Dates | Flexible pill is a white chip on an #ebebeb track.
    style: "soft",

    // Color
    // Rausch #ff385c, pinned verbatim; selection, checks and focus are ink #222.
    brand: "#ff385c",
    preserveSeed: true,
    selectionColor: "neutral",
    successSeed: "#038026",
    warningSeed: "#eb6100",
    // The rendered error family (text, field edges, icons).
    dangerSeed: "#c13515",
    neutralTint: 0,
    lightBg: 100,
    // The unshipped dark tokens: #111111 page.
    darkBg: 5,
    // Field and checkbox edges are #8c8c8c, not the #dddddd hairline.
    controlEdge: "strong",

    // Typography
    // Cereal is proprietary; Plus Jakarta Sans is the closest free match.
    bodyFont: "Plus Jakarta Sans",
    monoFont: "System Mono",
    // Titles from 22px track at -0.02em.
    titleStyle: "tight",
    fieldTextSize: "large",
    // Cereal 500 labels; Plus Jakarta reads a step lighter at the same weight.
    labelWeight: "semibold",

    // Shape
    // Base 16: controls, menus and cards 12, dialogs 32.
    radiusPx: 16,
    roleSurface: "md",
    rolePanel: "2xl",
    roleCard: "md",

    // Space
    // Buttons 32 / 40 / 48, fields 56–60.
    density: "spacious",

    // Surfaces
    // Menus and dialogs are borderless; depth is the shadow.
    surfaceEdge: "none",
    // Guest and host pages are white edge to edge.
    shellTone: "page",

    // Browser
    selectionHighlight: "browser",

    // States
    // A 2px #222 ring after a white gap; neutral is the nearest ink. Fields thicken to #222.
    focusColor: "neutral",
    focusInputStyle: "border",
    focusInputWeight: "thick",
    // 1px #c13515 edge on a #fff5f3 fill.
    invalidStyle: "tint",

    // Motion
    // Popovers fade in with no visible zoom.
    popoverEntrance: "fade",
    tooltipEntrance: "fade",
    dialogEntrance: "rise",

    // Buttons
    // #f2f2f2, no border.
    buttonSecondary: "soft",
    // Buttons and icon buttons shrink on press.
    buttonPress: "scale",

    // Selection
    switchColor: "neutral",
    checkboxColor: "neutral",
    radioColor: "neutral",
    // A 6px corner on a 22px box; the 16px base's detail rung reads as a circle.
    checkCorner: "sharp",
    sliderColor: "neutral",
    // 2px #dddddd price track.
    sliderTrack: "hairline",
    // A 2px #222 outline on white ("Any" in Type of place); the #f7f7f7 wash has no option.
    cardSelected: "outline",
    // Selected is ink everywhere; chips really take an ink edge, which has no option.
    toggleSelected: "inverse",

    // Inputs
    inputHover: "edge",
    inputHeight: "tall",
    inputError: "icon-message",
    // − and + at both ends; Airbnb's are free 32px circles, not cells.
    numberLayout: "split",
    selectTrigger: "field",

    // Menus & popovers
    // The current sort option is bold only; the default check stands in.
    menuInset: "full-bleed",
    menuArrows: "none",

    // Dialogs
    dialogBackdrop: "scrim",
    dialogSections: "divided",
    // "Clear all" left, the confirm right.
    dialogActions: "spread",
    // Login opens as a full page at 390px.
    mobileDialogs: "fullscreen",

    // Navigation
    tabStyle: "line",
    linkUnderline: "always",
    linkColor: "neutral",
    // Search results mark the current page with an ink circle.
    paginationCurrent: "selected",

    // Feedback
    badgeStyle: "soft",
    badgeShape: "rounded",
    spinnerStyle: "dots",
    skeletonAnimation: "pulse",
    // 4px rating bars fill in ink.
    progressColor: "same-checks",

    // Data display
    // 42px circle days, no today marker.
    calendarDayShape: "circle",
    calendarToday: "numeral",
  },
})

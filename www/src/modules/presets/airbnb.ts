import { definePreset } from "./preset"

export const airbnb = definePreset({
  id: "airbnb",
  name: "Airbnb",
  description: "Rausch CTAs, ink selection, big soft targets.",
  swatch: "#ff385c",
  inspiredBy: "Airbnb",
  diff: {
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
    // Popovers 0 2px 16px .12, dialogs 0 8px 28px .28.
    surfaceShadow: "medium",
    // Menus and dialogs are borderless; depth is the shadow.
    surfaceEdge: "none",
    // Guest and host pages are white edge to edge.
    shellTone: "page",

    // Browser
    selectionHighlight: "browser",

    // States
    // 2px white gap plus a 2px #222 ring; fields thicken to #222.
    focusColor: "neutral",
    focusInputStyle: "border",
    focusInputWeight: "thick",
    // 1px #c13515 edge on a #fff5f3 fill.
    invalidStyle: "tint",

    // Motion
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
    // The Dates | Flexible pill: a white chip on an #ebebeb track.
    segmentedSelected: "raised",

    // Inputs
    inputHover: "edge",
    inputHeight: "tall",
    inputError: "icon-message",
    // − and + circles either side of the value.
    numberLayout: "split",
    selectTrigger: "field",

    // Menus & popovers
    menuInset: "full-bleed",
    menuArrows: "none",
    // No check: the current sort option is bold; the tint stands in for the weight.
    menuIndicator: "none",
    menuSelectedRow: "tint",

    // Dialogs
    dialogBackdrop: "scrim",
    dialogSections: "divided",
    // "Clear all" left, the confirm right.
    dialogActions: "spread",
    mobileDialogs: "sheet",

    // Navigation
    tabStyle: "line",
    linkUnderline: "always",
    linkColor: "neutral",

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

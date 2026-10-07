import { definePreset } from "./preset"

export const github = definePreset({
  id: "github",
  name: "GitHub",
  description: "Green actions, blue selection.",
  swatch: "#1f883d",
  inspiredBy: "GitHub",
  diff: {
    // Color
    brand: "#1f883d",
    preserveSeed: true,
    // Checks, switches and focus stay Primer blue under the green actions.
    selectionSeed: "#0969da",
    successSeed: "#1f883d",
    warningSeed: "#9a6700",
    dangerSeed: "#cf222e",
    // #59636e…#0d1117 sit at OKLCH h≈253, peak chroma ≈0.023.
    neutralHue: 253,
    neutralTint: 1.4,
    lightBg: 100,
    // #0d1117.
    darkBg: 5,

    // Typography
    // Mona Sans heads Primer's stack, but github.com serves no face: it renders the system stack.
    bodyFont: "System",
    monoFont: "System Mono",
    titleStyle: "compact",

    // Icons
    iconLibrary: "octicons",

    // Shape
    // Base 8: 6px controls, rows and boxes; 12px overlays and dialogs.
    radiusPx: 8,
    roleItem: "md",
    roleSurface: "xl",
    roleCard: "md",
    tracks: "follow",

    // Surfaces
    // The issues sidebar sits on the page, split by a rule.
    shellTone: "page",

    // Browser
    selectionHighlight: "browser",

    // States
    focusStyle: "inset",
    focusInputStyle: "border",
    focusInputWeight: "thick",

    // Motion
    motionEntrance: "fade",

    // Charts
    chartPalette: "vivid",
    // Insights: a baseline under dashed gridlines.
    chartGrid: "dashed",

    // Components
    // Blue links aren't reachable under a green brand; underlined ink reads closer than green.
    linkUnderline: "always",
    linkColor: "neutral",
    breadcrumbSeparator: "slash",
    breadcrumbTone: "link",
    // Primer's current page is blue #0969da: Solid reads the selection seed.
    paginationCurrent: "selected",
    toggleSelected: "solid",
    buttonStyle: "hairline",
    switchStyle: "slab",
    // Checks wear #818b98, a step past the field edge.
    checkEdge: "strong",
    fieldLabel: "semibold",
    inputError: "icon-message",
    selectTrigger: "field",
    pickerCaret: "double",
    menuArrows: "none",
    menuIndicator: "check-start",
    menuRows: "match",
    mobilePickers: "anchored",
    // #c8d1da66 lands near 10% black; Wash's page step is too faint to reach it.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "light",
    dialogSections: "divided",
    tabStyle: "line",
    navMarker: "fill-bar",
    navWeight: "regular-semibold",
    alertStyle: "soft-outline",
    spinnerStyle: "ring-track",
    progressTrack: "thick",
    badgeStyle: "outline",
    kbdTreatment: "keycap",
    tableHeader: "filled",
    cardHeader: "band",
    cardFooter: "rule",
  },
})

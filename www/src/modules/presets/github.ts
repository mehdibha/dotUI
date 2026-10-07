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

    // Surfaces
    // The issues sidebar sits on the page, split by a rule.
    shellTone: "page",

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
    // The ToggleSwitch slab and the 3px progress bar are rounded rects.
    tracks: "follow",

    // States
    focusStyle: "inset",
    // A #0969da edge plus a 2px outline at -1px.
    focusInputStyle: "border",
    focusInputWeight: "thick",
    selectionHighlight: "browser",

    // Motion
    // Anchored overlays only fade (200ms).
    motionEntrance: "fade",

    // Buttons
    buttonStyle: "hairline",
    // Primer's current page is blue #0969da: Solid reads the selection seed.
    paginationCurrent: "selected",
    toggleSelected: "solid",

    // Selection
    // 64×32 ToggleSwitch with a half-width knob.
    switchStyle: "slab",
    // Checks wear #818b98, a step past the field edge.
    checkEdge: "strong",

    // Inputs
    // FormControl.Label is 14px 600.
    fieldLabel: "semibold",
    inputError: "icon-message",
    selectTrigger: "field",
    pickerCaret: "double",

    // Menus & popovers
    menuArrows: "none",
    menuIndicator: "check-start",
    // ActionList rows are 32px, the control height.
    menuRows: "match",
    mobilePickers: "anchored",

    // Dialogs
    // #c8d1da66 lands near 10% black; Wash's page step is too faint to reach it.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "light",
    dialogSections: "divided",

    // Navigation
    tabStyle: "line",
    navMarker: "fill-bar",
    // UnderlineNav and NavList rest at 400, current 600.
    navWeight: "regular-semibold",
    // Blue links aren't reachable under a green brand; underlined ink reads closer than green.
    linkUnderline: "always",
    linkColor: "neutral",
    breadcrumbSeparator: "slash",
    breadcrumbTone: "link",

    // Feedback
    alertStyle: "soft-outline",
    spinnerStyle: "ring-track",
    // 8px bar.
    progressTrack: "thick",

    // Data display
    badgeStyle: "outline",
    kbdTreatment: "keycap",
    tableHeader: "filled",
    // Box-header is a #f6f8fa band, Box-footer a top rule.
    cardHeader: "band",
    cardFooter: "rule",

    // Charts
    chartPalette: "vivid",
    // Insights: a baseline under dashed gridlines.
    chartGrid: "dashed",
  },
})

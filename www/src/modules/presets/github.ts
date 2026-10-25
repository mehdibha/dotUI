import { definePreset } from "./preset"

export const github = definePreset({
  id: "github",
  name: "GitHub",
  description: "Green actions, blue selection.",
  swatch: "#1f883d",
  inspiredBy: "GitHub",
  diff: {
    // Assets
    brandAssets: "github",

    // Color
    brand: "#1f883d",
    preserveSeed: true,
    // Checks, switches and focus stay Primer blue under the green actions.
    selectionSeed: "#0969da",
    successSeed: "#1f883d",
    warningSeed: "#9a6700",
    dangerSeed: "#cf222e",
    // #59636e…#0d1117 sit at OKLCH h≈253; 1.8 lands #d1d9e0 and #59636e, dark stays short of C 0.014.
    neutralHue: 253,
    neutralTint: 1.8,
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
    focusInputStyle: "thick-edge",
    selectionHighlight: "browser",

    // Motion
    // Anchored overlays only fade (200ms).
    popoverEntrance: "fade",
    tooltipEntrance: "fade",

    // Buttons
    buttonStyle: "hairline",
    // Primer's current page is blue #0969da: Solid reads the selection seed.
    paginationCurrent: "selected",
    toggleSelected: "solid",

    // Selection
    // ToggleSwitch: a 64×32 slab with a half-width knob (ours keeps the density's 24px height).
    switchStyle: "slab",
    // Checks wear #818b98, a step past the field edge.
    checkEdge: "strong",

    // Inputs
    // FormControl.Label is 14px 600.
    fieldLabel: "semibold",
    inputError: "icon-message",
    // Stand-in: a chevron caret. Primer's Select draws a double triangle, and Octicons' Unfold (the double caret) reads as a glitch.
    selectTrigger: "field",

    // Menus & popovers
    menuArrows: "none",
    menuIndicator: "check-start",
    // ActionList rows are 32px, the control height.
    menuRows: "match",
    mobilePickers: "anchored",

    // Dialogs
    // Stand-in: Primer's #c8d1da66 / #21283066 wash. Wash's page step is too faint to reach it; a light scrim lands near.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "light",
    dialogSections: "divided",

    // Navigation
    // Stand-in: UnderlineNav underlines the current tab in coral (#fd8c73 / #f78166); ours draws ink.
    tabStyle: "line",
    // NavList: a gray wash plus a 4px bar, the bar in #0969da / #1f6feb (ours draws ink).
    navMarker: "fill-bar",
    // UnderlineNav and NavList rest at 400, current 600.
    navWeight: "regular-semibold",
    // Stand-in: links are #0969da / #4493f8 at 400. Blue isn't reachable under the green brand; underlined ink reads closer than green.
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
    // Label: body ink in a #d1d9e0 / #3d444d hairline. Stand-in: accent labels are blue, ours take the green brand.
    badgeStyle: "outline",
    // Stand-in: KeybindingHint is a #eff2f5 chip in a hairline at 6px; markdown <kbd> adds an inset bottom edge.
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

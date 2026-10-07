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
    neutralHue: 251,
    successSeed: "#1f883d",
    warningSeed: "#9a6700",
    dangerSeed: "#cf222e",
    // Checked controls and focus stay Primer blue under the green actions.
    selectionSeed: "#0969da",
    neutralTint: 1.4,
    preserveSeed: true,
    lightBg: 100,
    darkBg: 5,

    // Typography
    bodyFont: "Mona Sans",

    // Shape
    radiusPx: 8,
    roleItem: "md",
    roleSurface: "xl",
    roleCard: "xl",

    // Browser
    selectionHighlight: "browser",

    // States
    // An inset ring measured ~1.1:1 on the green and red fills.
    focusStyle: "inset",
    focusInputStyle: "border",
    focusInputWeight: "thick",

    // Motion
    // Primer's overlays fade in; its dialogs scale.
    motionEntrance: "fade",

    // Components
    // Underlined at rest so links don't rely on color alone (WCAG 1.4.1).
    linkUnderline: "always",
    linkColor: "neutral",
    progressTrack: "thick",
    buttonStyle: "hairline",
    segmentedSelected: "raised",
    pickerCaret: "double",
    menuIndicator: "check-start",
    tabStyle: "line",
    breadcrumbSeparator: "slash",
    badgeStyle: "outline",
    kbdTreatment: "keycap",
    tableHeader: "filled",
  },
})

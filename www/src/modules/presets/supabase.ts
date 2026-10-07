import { definePreset } from "./preset"

export const supabase = definePreset({
  id: "supabase",
  name: "Supabase",
  description: "Emerald on neutral graphite.",
  swatch: "#34b27b",
  inspiredBy: "Supabase",
  diff: {
    // Color
    brand: "#3ecf8e",
    selectionColor: "neutral",
    neutralHue: 160,
    neutralTint: 0.3,
    // Primary is exactly #3ecf8e, as live.
    preserveSeed: true,
    darkBg: 6,

    // Typography
    headingFont: "Manrope",
    bodyFont: "Inter",
    monoFont: "Source Code Pro",
    sectionLabels: "mono-caps",

    // Shape
    radiusPx: 10.5,
    roleItem: "xs",
    roleSurface: "md",
    rolePanel: "lg",
    roleCard: "lg",

    // States
    focusInputStyle: "ring",
    disabledTreatment: "fade",

    // Components
    linkUnderline: "always",
    linkColor: "neutral",
    skeletonAnimation: "pulse",
    buttonStyle: "hairline",
    segmentedSelected: "tone",
    checkboxColor: "neutral",
    inputHover: "edge",
    sliderColor: "neutral",
    menuIndicator: "check-start",
    menuSearch: "bar",
    menuScale: "large",
    dialogBackdropStrength: "light",
    tooltipStyle: "surface",
    tabStyle: "line",
    badgeStyle: "soft-outline",
    tableHeader: "filled",
  },
})

import { definePreset } from "./preset"

export const supabase = definePreset({
  id: "supabase",
  name: "Supabase",
  description: "Deep emerald plates on pure gray, mono caps labels.",
  swatch: "#3ecf8e",
  inspiredBy: "Supabase",
  diff: {
    // Assets
    brandAssets: "supabase",

    // Color
    // The 2026 plate is a deep emerald with light ink (#0e7e4e), not the mint.
    brand: "#0e7e4e",
    preserveSeed: true,
    // The bright mint of rings, switches and the calendar (#30ba79).
    selectionSeed: "#30ba79",
    successSeed: "#3ecf8e",
    warningSeed: "#ac5800",
    dangerSeed: "#ab413e",
    neutralTint: 0,
    darkBg: 6,
    // chart-1..8: brand, blue, pink, violet, tomato, indigo, green, purple.
    chartPalette: "vivid",

    // Typography
    headingFont: "Manrope",
    bodyFont: "Inter",
    monoFont: "Source Code Pro",
    // Manrope 600 at -0.025em.
    titleStyle: "tight",
    sectionLabels: "mono-caps",

    // Icons
    // The dashboard passes 1.5 in 74 of 98 explicit stroke props.
    iconStroke: 1.5,

    // Shape
    // Tailwind's radii: 6px controls, 4px menu rows, 8px cards and dialogs.
    radiusPx: 8,
    roleSurface: "md",
    rolePanel: "lg",
    roleCard: "lg",

    // Space
    // 26px buttons, 34px fields. Compact's 12px text matches buttons, menu
    // rows and tooltips; fields and tabs set 13px (stand-in: one UI size).
    density: "compact",
    inputHeight: "step",

    // Surfaces
    surfaceShadow: "low",
    // The sidebar is the page color.
    shellTone: "page",

    // States
    // A 2px ring at 55% of the mint behind a 2px page-colored offset.
    focusStrength: "soft",
    focusInputStyle: "ring",
    invalidStyle: "tint",
    disabledTreatment: "fade",
    cursorDisabled: "default",

    // Components
    buttonStyle: "hairline",
    buttonSecondary: "raised",
    buttonPress: "scale",
    // ButtonGroup is one bordered box split by dividers.
    groupSeparator: "divider",
    // A sliding accent-alpha chip; the default tone has no track at all.
    segmentedSelected: "tone",
    segmentedTrack: "outline",
    checkboxColor: "neutral",
    radioMark: "ring",
    cardSelected: "outline",
    // Hairline's Auto (Inset) beats Well: Supabase's well is 1.5% black in
    // light and darker than the page in dark; hover darkens the edge.
    inputHover: "edge",
    sliderThumb: "solid",
    sliderColor: "neutral",
    progressColor: "same-checks",
    calendarWeekdays: "double",
    menuArrows: "none",
    menuIndicator: "check-start",
    menuSearch: "bar",
    // ⌘K: a 56px search over 43px rows. Rows set 13px text; large's 16px is a stand-in.
    menuScale: "large",
    dialogFrost: "subtle",
    dialogSections: "divided",
    tooltipStyle: "surface",
    tabStyle: "line",
    navWeight: "regular",
    navItemWeight: "regular-medium",
    linkUnderline: "always",
    linkColor: "neutral",
    alertStyle: "soft-outline",
    toastStatus: "soft",
    badgeStyle: "soft-outline",
    badgeCase: "uppercase",
    kbdTreatment: "outline",
    cardHeader: "rule",
    cardFooter: "rule",
  },
})

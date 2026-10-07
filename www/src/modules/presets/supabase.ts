import { definePreset } from "./preset"

export const supabase = definePreset({
  id: "supabase",
  name: "Supabase",
  description: "Deep emerald plates on pure gray, mono caps labels.",
  swatch: "#3ecf8e",
  inspiredBy: "Supabase",
  diff: {
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

    // Typography
    headingFont: "Manrope",
    bodyFont: "Inter",
    monoFont: "Source Code Pro",
    // Manrope 600 at -0.025em.
    titleStyle: "tight",
    uiTextSize: "13",
    sectionLabels: "mono-caps",

    // Icons
    // The dashboard passes 1.5 in 74 of 98 explicit stroke props.
    iconStroke: 1.5,

    // Shape
    // Tailwind radii × 4/3: 8px controls, 10.67px cards and dialogs.
    radiusPx: 10.5,
    roleSurface: "md",
    rolePanel: "lg",
    roleCard: "lg",

    // Space
    // 26px buttons, 34px fields.
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
    segmentedSelected: "tone",
    segmentedTrack: "outline",
    checkboxColor: "neutral",
    radioMark: "ring",
    cardSelected: "outline",
    // Fields take Hairline's Auto (Inset); hover darkens the edge to 29.8%.
    inputHover: "edge",
    sliderThumb: "solid",
    sliderColor: "neutral",
    progressColor: "same-checks",
    calendarWeekdays: "double",
    menuArrows: "none",
    menuIndicator: "check-start",
    menuSearch: "bar",
    menuScale: "large",
    dialogFrost: "subtle",
    dialogSections: "divided",
    dialogClose: "faint",
    tooltipStyle: "surface",
    tabStyle: "line",
    // Tabs keep their weight; the product menu's current row goes semibold.
    navWeight: "regular",
    navItemWeight: "regular-semibold",
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

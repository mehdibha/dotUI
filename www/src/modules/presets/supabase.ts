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
    // Fields, labels and tabs set 13px; buttons, menu rows and tooltips set
    // 12px (stand-in: one UI size).
    uiTextSize: "13",
    sectionLabels: "mono-caps",

    // Icons
    // The dashboard passes 1.5 in 74 of 98 explicit stroke props.
    iconStroke: 1.5,

    // Shape
    // The dashboard scales Tailwind's radii by 4/3: 8px controls and nav rows,
    // 10.67px cards and dialogs.
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
    // Stand-in: the full mint.
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
    // Choice cards keep Origin's tint: a checked radio card steps its 1px
    // edge to border-control-hover on a surface-300 fill, no 2px frame.
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
    // ⌘K: a 56px search over 43px rows at 13px. The default scale keeps the
    // 13px text; Large's 16px read louder than the rest of the UI.
    dialogFrost: "subtle",
    dialogSections: "divided",
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

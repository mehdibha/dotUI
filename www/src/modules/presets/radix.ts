import { definePreset } from "./preset"

export const radix = definePreset({
  id: "radix",
  name: "Radix",
  description: "Indigo on slate, small corners and soft accents.",
  swatch: "#3e63dd",
  inspiredBy: "Radix Themes",
  diff: {
    // Color
    brand: "#3e63dd",
    preserveSeed: true,
    successSeed: "#30a46c",
    warningSeed: "#ffc53d",
    dangerSeed: "#e5484d",
    // Pages: #ffffff and slate-1 #111113.
    lightBg: 100,
    darkBg: 5,

    // Typography: Themes ships the platform stacks (Menlo/Consolas for code).
    bodyFont: "System",
    monoFont: "System Mono",
    titleStyle: "bold",

    // Icons: Radix Icons aren't in the catalog; a lighter Lucide nears their 1px line.
    iconStroke: 1.5,

    // Shape: radius medium is 4px controls inside 8px menus and 12px dialogs.
    radiusPx: 8,
    roleControl: "sm",
    roleItem: "sm",

    // States: fields focus in place with a 2px light-indigo edge.
    focusStrength: "soft",
    focusInputStyle: "border",
    focusInputWeight: "thick",
    cursorControls: "default",

    // Motion: expo-out poppers.
    motion: "smooth",

    // Buttons: soft gray beside the solid primary.
    buttonSecondary: "soft",
    segmentedSelected: "ring",

    // Inputs: the select trigger wears the text-field shell.
    inputHover: "none",
    fieldLabel: "semibold",
    selectTrigger: "field",

    // Selection
    cardSelected: "outline",
    sliderTrack: "medium",

    // Menus & popovers: a solid indigo highlight, checks in a leading column.
    menuHighlight: "accent",
    menuIndicator: "check-start",
    menuRows: "match",
    mobilePickers: "anchored",

    // Dialogs: a plain 40% scrim, no blur.
    dialogBackdrop: "scrim",
    dialogEntrance: "rise",

    // Navigation
    tabStyle: "line",
    tabsColor: "accent",
    navWeight: "regular-medium",
    linkUnderline: "hover",

    // Feedback
    badgeStyle: "soft",
    badgeShape: "rounded",
    alertStyle: "soft",
    spinnerStyle: "blades",
    skeletonAnimation: "pulse",
    progressTrack: "medium",
    progressTrackStyle: "bordered",

    // Data display
    tableHeaderLabel: "strong",
    avatarShape: "rounded",
    avatarFallback: "accent",
    kbdTreatment: "keycap",
  },
})

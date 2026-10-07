import { definePreset } from "./preset"

export const radix = definePreset({
  id: "radix",
  name: "Radix",
  description: "Indigo on slate, small corners and soft accents.",
  swatch: "#3e63dd",
  inspiredBy: "Radix Themes",
  diff: {
    // Color
    // indigo-9, the same solid in light and dark; slate pairs at tint 1.
    brand: "#3e63dd",
    preserveSeed: true,
    successSeed: "#30a46c",
    warningSeed: "#ffc53d",
    dangerSeed: "#e5484d",
    // Pages: #ffffff and slate-1 #111113.
    lightBg: 100,
    darkBg: 5,

    // Typography
    // Themes ships the platform stacks (Menlo/Consolas for code).
    bodyFont: "System",
    monoFont: "System Mono",
    // Headings 700 in the body family.
    titleStyle: "bold",

    // Icons
    // Radix Icons aren't in the catalog; a lighter Lucide nears their 1px line.
    iconStroke: 1.5,

    // Shape
    // Radius medium: 4px controls and rows, 8px menus and cards, 12px dialogs.
    radiusPx: 8,
    roleControl: "sm",
    roleItem: "sm",

    // States
    // Buttons: a 2px indigo-8 #8da4ef outline; fields: a 2px edge in place.
    focusStrength: "soft",
    focusInputStyle: "border",
    focusInputWeight: "thick",
    cursorControls: "default",

    // Motion
    // Expo-out cubic-bezier(.16,1,.3,1): poppers 160ms, dialogs 200ms.
    motion: "smooth",

    // Buttons
    // The docs dialogs pair a gray-a3 soft Cancel with the solid primary.
    buttonSecondary: "soft",
    // A page-colored chip on a gray-a3 track, with a gray-a4 ring.
    segmentedSelected: "ring",

    // Selection
    // Radio and checkbox cards: a 2px accent outline, no tint.
    cardSelected: "outline",
    // 8px track.
    sliderTrack: "medium",

    // Inputs
    // Surface fields: white in light, recessed in dark (#121314 in #18191b).
    inputStyle: "inset",
    // Labels are bold 700; Semibold is the heaviest field label.
    fieldLabel: "semibold",
    selectTrigger: "field",

    // Menus & popovers
    // A solid indigo row with white text, checks in a leading column.
    menuHighlight: "accent",
    menuIndicator: "check-start",
    // 32px rows, the control height.
    menuRows: "match",
    mobilePickers: "anchored",

    // Dialogs
    // A plain 40% black scrim, no blur; a 5px rise with a .97 scale.
    dialogBackdrop: "scrim",
    dialogEntrance: "rise",
    // No built-in X; Faint is the quietest close.
    dialogClose: "faint",

    // Navigation
    // A full-width 2px indigo line; labels 400 → 500 when active.
    tabStyle: "line",
    tabsColor: "accent",
    navWeight: "regular-medium",
    linkUnderline: "hover",

    // Feedback
    badgeStyle: "soft",
    // 3px badge corners.
    badgeShape: "rounded",
    alertStyle: "soft",
    // 8 blades, 800ms.
    spinnerStyle: "blades",
    skeletonAnimation: "pulse",
    // 6px track with an inset gray-a4 ring.
    progressTrack: "medium",
    progressTrackStyle: "bordered",

    // Data display
    tableHeaderLabel: "strong",
    // 6px rounded squares in soft accent.
    avatarShape: "rounded",
    avatarFallback: "accent",
    kbdTreatment: "keycap",
  },
})

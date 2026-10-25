import { definePreset } from "./preset"

export const radix = definePreset({
  id: "radix",
  name: "Radix",
  description: "Indigo on slate, small corners and soft accents.",
  swatch: "#3e63dd",
  inspiredBy: "Radix Themes",
  diff: {
    // Assets
    brandAssets: "radix",

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
    // Headings 700 in the body family. Stand-in: Radix sets 35/28/24/20px with
    // -1% to -0.5% tracking; Bold gives 36/30/24/20px, untracked.
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
    // A 2px outline 2px out, on accent step 8 (#8da4ef / #435db1). Stand-in:
    // the full accent.
    // Fields: the same outline set 1px in, over the edge; a thick edge draws
    // that 2px line in the accent.
    focusInputStyle: "thick-edge",
    cursorControls: "default",

    // Motion
    // Expo-out cubic-bezier(.16,1,.3,1): poppers 160ms, dialogs 200ms.
    motion: "smooth",

    // Buttons
    // The docs dialogs pair a gray-a3 soft Cancel with the solid primary. Its
    // label is gray-a11 (#5a5f68 / #b7bcc1); Soft keeps body ink.
    buttonSecondary: "soft",
    // A page-colored chip on a gray-a3 track, with a gray-a4 ring.
    segmentedSelected: "ring",

    // Selection
    // Radio and checkbox cards: a 2px accent outline, no tint.
    cardSelected: "outline",
    // 8px track.
    sliderTrack: "medium",

    // Inputs
    // Surface fields: white in light, black 25% in dark (#0d0d0e on the page).
    // Stand-in: Inset matches both and adds a faint inner shadow Radix lacks.
    inputStyle: "inset",
    // Labels are bold 700; Semibold is the heaviest field label.
    fieldLabel: "semibold",
    selectTrigger: "field",

    // Menus & popovers
    // A solid indigo row with white text, checks in a leading column.
    menuHighlight: "accent",
    menuIndicator: "check-start",
    // 32px rows, the control height. Radix insets labels 12px, ours 6px.
    menuRows: "match",
    mobilePickers: "anchored",

    // Dialogs
    // A plain black scrim, no blur: 40% in light, 60% in dark (Medium is 40%
    // in both). Entrance: a 5px rise with a .97 scale.
    dialogBackdrop: "scrim",
    dialogEntrance: "rise",
    // No built-in X; Faint is the quietest close.
    dialogClose: "faint",

    // Navigation
    // A full-width 2px indigo line; labels 400 → 500 when active. Radix tabs
    // stand 40px tall, ours 31px.
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
    // Keycaps at 0.35em corners (4px at 12px) in full ink, raised by inset
    // shadows on a 0.6px ring. Stand-in: Keycap draws a 2px bottom edge in
    // muted ink, at the small control rung (2px here).
    kbdTreatment: "keycap",
  },
})

import { definePreset } from "./preset"

export const claude = definePreset({
  id: "claude",
  name: "Claude",
  description: "Ink actions on warm paper, blue checks, a serif voice.",
  swatch: "#d97757",
  inspiredBy: "Claude",
  diff: {
    // Color
    // Clay is the identity; actions are #0b0b0b ink.
    brand: "#d97757",
    buttonColor: "neutral",
    // CDS role-accent is blue #2a78d6: checks, radios, switches, focus.
    selectionSeed: "#2a78d6",
    successSeed: "#009300",
    warningSeed: "#fab219",
    dangerSeed: "#d03b3b",
    // Grays sit at OKLCH hue 91-106, chroma at most .015.
    neutralHue: 100,
    neutralTint: 0.7,
    // #151515 page in dark.
    darkBg: 7,
    // The docs sidebar shares the #fcfcfb page behind a hairline.
    shellTone: "page",
    // Fields and secondary buttons ring at 10% ink, 20% on hover.
    controlEdge: "soft",

    // Typography
    // Instrument Sans, Source Serif 4 and JetBrains Mono stand in for the
    // proprietary Anthropic Sans, Serif and Mono.
    bodyFont: "Instrument Sans",
    headingFont: "Source Serif 4",
    monoFont: "JetBrains Mono",
    // Claude's replies read in the serif.
    readingFont: "Source Serif 4",
    // Secondary, ghost and segmented labels are 400; only primary is 500.
    labelWeight: "normal",

    // Icons
    // Anthropicons are Phosphor-shaped.
    iconLibrary: "phosphor",

    // Shape
    // 8px controls and rows inside 12px menus, dialogs and cards.
    radiusPx: 8,
    roleControl: "lg",
    roleSurface: "xl",
    roleCard: "xl",

    // States
    // A 1px #2a78d6 ring hugging the edge, a page-colored line inside fills.
    focusStyle: "inset",
    focusWidth: 1,
    // Fields: the 10% ring turns blue.
    focusInputStyle: "border",
    disabledTreatment: "fade",
    cursorDisabled: "default",
    // No ::selection rule.
    selectionHighlight: "browser",

    // Motion
    // easeOutQuart over 120-200ms.
    motion: "smooth",

    // Buttons
    // A page plate, 10% ring and a 1px 5% drop; paint scales to .975.
    buttonSecondary: "raised",
    buttonPress: "scale",
    // Pressed toggles turn #cde2fb with #184f95 ink.
    toggleSelected: "tint",
    segmentedSelected: "raised",

    // Inputs
    inputHover: "edge",
    fieldLabel: "medium",
    inputError: "icon-message",
    otpStyle: "separate",

    // Selection
    sliderColor: "neutral",
    cardSelected: "outline-tint",

    // Menus & popovers
    menuRows: "match",
    menuArrows: "none",
    // The 672px palette: a borderless 56px search bar over 36px rows.
    menuSearch: "bar",
    menuScale: "large",

    // Dialogs
    dialogBackdrop: "scrim",
    mobileDialogs: "sheet",

    // Navigation
    // Ghost pills with a 5% ink wash on the current tab.
    tabStyle: "pill",
    tabsPill: "tone",
    navItemWeight: "regular",
    linkUnderline: "always",
    // Links are blue #184f95; accent would paint them clay.
    linkColor: "neutral",

    // Feedback
    badgeStyle: "soft",
    badgeShape: "rounded",
    alertStyle: "soft-outline",
    toastStatus: "soft",
    spinnerStyle: "ring-track",
    progressTrack: "medium",
    progressTrackStyle: "bordered",
    // A 6px #2a78d6 fill.
    progressColor: "same-checks",

    // Data display
    tableHeaderLabel: "strong",
    kbdTreatment: "outline",
    chartPalette: "vivid",
  },
})

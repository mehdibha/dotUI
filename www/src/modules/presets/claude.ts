import { definePreset } from "./preset"

export const claude = definePreset({
  id: "claude",
  name: "Claude",
  description: "Ink actions on white, blue checks, a serif voice.",
  swatch: "#d97757",
  inspiredBy: "Claude",
  diff: {
    // Assets
    brandAssets: "claude",

    // Color
    // CDS role-accent #2a78d6 paints checks, links, focus and accent badges;
    // clay lives only in the logo, so in the swatch. Actions are #0b0b0b ink.
    brand: "#2a78d6",
    buttonColor: "neutral",
    successSeed: "#009300",
    warningSeed: "#fab219",
    dangerSeed: "#d03b3b",
    // The 2026-10-26 census paints every neutral at chroma 0: #fff and
    // #fafafa surfaces, #191919 / #666 / #888 ink, #ebebeb edges.
    neutralTint: 0,
    // #151515 page in dark (the 2026-10-26 census reads #191919; kept until
    // the pack is re-measured).
    darkBg: 7,
    // The sidebar shares the #fcfcfb page (#fbfbf9). The 2026-10-26 census
    // sets it #fafafa beside a #fff page; kept until the pack is re-measured.
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
    // Stand-in: a 1px #2a78d6 ring just outside the edge over a 1px
    // page-colored inset line; inset draws the same pair 1px further in.
    focusStyle: "inset",
    focusWidth: 1,
    // Fields: the 10% ring turns #2a78d6, under a faint 6px #cde2fb glow.
    focusInputStyle: "edge",
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
    inputError: "icon-message",
    otpStyle: "separate",
    // Selects wear the fields' 1px inset ring (Claude Code settings) or no
    // frame at all (Capabilities), never the raised secondary plate.
    selectTrigger: "field",

    // Selection
    cardSelected: "outline-tint",

    // Menus & popovers
    menuRows: "match",
    menuArrows: "none",
    // The 672px palette: a borderless 56px search bar over 36px rows.
    menuSearch: "bar",

    // Dialogs
    dialogBackdrop: "scrim",
    mobileDialogs: "sheet",

    // Navigation
    // Ghost pills with a 5% ink wash on the current tab.
    tabStyle: "pill",
    tabsPill: "tone",
    navItemWeight: "regular",
    linkUnderline: "always",

    // Feedback
    // 18px pills at 11px in a 1.5px edge on the surface: blue #1757ac in
    // #cadef4, neutral #666 in #e0e0e0 (211 in the 2026-10-26 census).
    badgeStyle: "outline",
    alertStyle: "soft-outline",
    toastStatus: "soft",
    spinnerStyle: "ring-track",
    progressTrackStyle: "bordered",
    // A 4px bar, its #2a78d6 fill the checks' blue.
    progressColor: "same-checks",

    // Data display
    tableHeaderLabel: "strong",
    kbdTreatment: "outline",
    chartPalette: "vivid",
  },
})

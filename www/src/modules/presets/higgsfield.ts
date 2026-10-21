import { definePreset } from "./preset"

export const higgsfield = definePreset({
  id: "higgsfield",
  name: "Higgsfield",
  description: "Electric lime on graphite, glass menus.",
  swatch: "#d1fe17",
  inspiredBy: "Higgsfield",
  diff: {
    // Style
    // Cards and fields step up one gray (#23262a on #131416), no borders.
    style: "tonal",
    surfaceShadow: "flat",
    // Tertiary buttons are white 10%, no edge.
    buttonSecondary: "soft",
    segmentedSelected: "tone",
    // q-field-control is white 5%, no edge.
    inputStyle: "filled",

    // Color
    // The app is dark only; light mode keeps the lime and the cool grays.
    brand: "#d1fe17",
    preserveSeed: true,
    // Grays lean blue: #131416 / #1c1e21 / #23262a sit at OKLCH hue 255–265.
    neutralHue: 258,
    successSeed: "#2eb844",
    // icon-warning; the #ffef33 border sits next to the lime.
    warningSeed: "#dfab01",
    dangerSeed: "#fa0019",
    // background-primary #131416 is L* 6.3.
    darkBg: 6.5,
    controlEdge: "soft",

    // Typography
    bodyFont: "Inter",
    headingFont: "Space Grotesk",
    // Stand-in: titles are 700 uppercase at -0.04em.
    titleStyle: "bold",
    // Stand-in: Space Mono is not in the catalog.
    monoFont: "Martian Mono",

    // Shape
    // Fields, toggles and menus 12px; dialogs 24px.
    // Stand-in: buttons round 10px, a step below the fields.
    radiusPx: 12,
    roleControl: "lg",
    rolePanel: "2xl",
    // Home cards are #23262a at 12px.
    roleCard: "lg",

    // Space
    // Buttons and fields 40px with 16px button padding.
    density: "spacious",

    // Surfaces
    // Menus and dialogs are #23262a at 75% over a 40px blur.
    translucentOverlays: true,
    shellTone: "page",

    // States
    // An inset 1.5px lime line, no ring.
    focusInputStyle: "border",
    disabledTreatment: "fade",

    // Toggles
    // Pressed toggles: lime 10%. Stand-in: the label stays white, not lime.
    toggleSelected: "tint",

    // Selection
    radioMark: "ring",

    // Inputs
    // A white 5% overlay on hover.
    inputHover: "tint",
    fieldLabel: "medium",
    selectTrigger: "field",

    // Dialogs
    // Black 50%, no blur.
    dialogBackdrop: "scrim",
    // Close is a round white 5% chip.
    dialogClose: "filled",

    // Navigation
    // 52px tabs, tertiary ink, a 2px indicator over a white 5% rule.
    tabStyle: "line",
    // The current header link turns lime, no fill.
    // Stand-in: the default tab indicator is white (q-tabs-tone-accent paints it lime).
    tabsColor: "accent",
    navMarker: "ink",
    navItemWeight: "medium",

    // Data display
    // Lime 15–20% under lime 10/700 caps, 6px corners.
    badgeStyle: "soft",
    badgeShape: "rounded",
    badgeCase: "uppercase",
  },
})

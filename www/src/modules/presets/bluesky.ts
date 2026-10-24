import { definePreset } from "./preset"

export const bluesky = definePreset({
  id: "bluesky",
  name: "Bluesky",
  description: "Slate-blue grays, bright blue, soft pill buttons.",
  swatch: "#1083fe",
  inspiredBy: "Bluesky",
  diff: {
    // Color
    brand: "#006aff",
    // Grays carry the brand's hue: #667b99 is OKLCH 0.58 0.053 257.
    neutralHue: 257,
    neutralTint: 2,
    successSeed: "#09b35e",
    warningSeed: "#ffc404",
    dangerSeed: "#e91646",
    // Dark is Bluesky's default Dim theme, page #151d28.
    lightBg: 100,
    darkBg: 10.5,
    selectedWash: "brand",
    controlEdge: "soft",

    // Typography
    bodyFont: "Inter",
    // Display names 700, dialog titles 20.6px 700.
    titleStyle: "bold",
    // Button labels 13.1px, field values 15px.
    uiTextSize: "13",
    fieldTextSize: "large",

    // Shape
    // Fields 10px, menus 8px, dialogs and cards 12px, menu rows 4px.
    radiusPx: 8.5,
    roleControl: "lg",
    roleCard: "xl",
    roleItem: "sm",

    // Surfaces
    // The left rail sits on the page.
    shellTone: "page",

    // States
    // Fields: a 1px primary edge on a primary_25 fill, no ring.
    focusInputStyle: "edge",
    invalidStyle: "tint",
    disabledTreatment: "fade",
    selectionHighlight: "browser",

    // Buttons
    // Secondary: a #eff2f6 fill, muted label, no edge.
    buttonSecondary: "soft",
    buttonRadius: "pill",

    // Toggles
    // Selected interest chips: a dark fill, light label.
    toggleSelected: "inverse",

    // Segmented control
    // A white chip with a 5% drop on a #eff2f6 track.
    segmentedSelected: "raised",

    // Inputs
    // A #eff2f6 fill, no edge; the edge shows on hover.
    inputStyle: "filled",
    inputHover: "edge",
    inputHeight: "tall",

    // Field
    // Labels 13.1px 500 over the field.
    fieldLabel: "medium",

    // Select
    selectTrigger: "field",

    // Menus & popovers
    // Rows 36px at 4px corners.
    menuRows: "step",
    // Stand-in: tooltips are a contrast_100 chip, #dce2ea / #2c3a4e, no edge.
    tooltipStyle: "surface",

    // Dialogs
    // Black 80%, no blur; dialogs sit 10vh from the top.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "heavy",
    dialogPosition: "top",

    // Navigation
    tabStyle: "line",
    tabsColor: "accent",
    // Stand-in: ink tints the current item; Bluesky keeps its color and fills
    // its icon.
    navMarker: "ink",
    // Profile and search tabs 15px 600, selected or not.
    navWeight: "semibold",
    // The left rail: 18.8px labels, regular, bold when current, no fill.
    // Stand-in: semibold for bold.
    navItemWeight: "regular-semibold",
    // A 3px primary bar under the label.
    tabIndicator: "label",
    linkUnderline: "hover",

    // Feedback
    // Admonitions: a status edge and icon on the page.
    // Stand-in: outline also colors the text, which Bluesky keeps in ink.
    alertStyle: "outline",
    toastStatus: "soft",
  },
})

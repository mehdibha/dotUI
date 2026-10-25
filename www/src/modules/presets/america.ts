import { definePreset } from "./preset"

export const america = definePreset({
  id: "america",
  name: "America.gov",
  description: "Navy pills, serif headlines, big soft panels.",
  swatch: "#002664",
  inspiredBy: "America.gov",
  diff: {
    // Color
    // Navy blue-700 #002664 under the CTA and the checks.
    brand: "#002664",
    preserveSeed: true,
    // Ink #000c1f; grays are that ink at an alpha, OKLCH hue ~258.
    neutralHue: 258,
    successSeed: "#007f26",
    warningSeed: "#e7a800",
    dangerSeed: "#d80007",
    lightBg: 100,
    // #0b0d12.
    darkBg: 3.5,
    // Fields and checkboxes take border-secondary, ink at 45%. Strong also
    // gives the neutral focus ring the text ink.
    controlEdge: "strong",

    // Typography
    // Stand-in: Helvetica Now Text and Display are commercial.
    bodyFont: "Inter",
    // Stand-in: Rhymes Text, regular weight at -0.05 to -0.06em.
    headingFont: "Newsreader",
    titleStyle: "display",

    // Icons
    // Filled glyphs with crisp corners and square ends.
    iconLibrary: "material-symbols",

    // Shape
    // Fields 16px, dialogs and the menu sheet 40, cards and tiles 48 drawn as
    // squircles (57px computed).
    radiusPx: 20,
    roleSurface: "2xl",
    rolePanel: "2xl",
    roleCard: "3xl",

    // Space
    // 16px control text; form buttons 56px at 24px padding.
    density: "touch",

    // Surfaces
    // Panels and cards sit on navy at 5% with no edge or shadow.
    surfaceLayers: "tonal",
    surfaceEdge: "none",

    // States
    // 0 0 0 2px #fff, 0 0 0 4px #0c0c0c on buttons; fields recolor their
    // edge to the ring and add a 1px inset ring.
    focusColor: "neutral",
    focusInputStyle: "thick-edge",

    // Links
    // Prose links keep the text color, underlined.
    linkUnderline: "always",
    linkColor: "neutral",

    // Buttons
    buttonRadius: "pill",
    // Secondary is navy at 5%, white at 5% in dark.
    buttonSecondary: "soft",
    // scale(0.98).
    buttonPress: "scale",
    // A white pill with the widget shadow on a tinted track.
    segmentedSelected: "raised",

    // Inputs
    // A page-colored box in both themes; Outline tints the dark fill.
    inputStyle: "inset",
    inputHover: "edge",
    // Stand-in: a field-styled trigger, like the form fields (the only select
    // is the footer's native language picker, a ghost).
    selectTrigger: "field",

    // Selection
    // Stand-in: 20px checks at 6px corners; Auto rounds 16px checks to circles.
    checkCorner: "sharp",

    // Menus & popovers
    // White 36px pills with the widget shadow.
    tooltipStyle: "surface",

    // Dialogs
    // Black at 20% under a 12px blur.
    dialogBackdropStrength: "light",
    dialogClose: "filled",
    // The Menu sheet floats 16px in from the edge at 40px corners.
    drawerEdge: "detached",

    // Feedback
    // The Before / Now bars are 12px.
    progressTrack: "thick",
  },
})

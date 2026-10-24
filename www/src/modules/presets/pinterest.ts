import { definePreset } from "./preset"

export const pinterest = definePreset({
  id: "pinterest",
  name: "Pinterest",
  description: "Red CTAs, ink chips, big soft 16px controls.",
  swatch: "#e60023",
  inspiredBy: "Pinterest",
  diff: {
    // Color
    // Red is only the primary CTA; checks, switches, sliders and focus are
    // blue #435ee5.
    brand: "#e60023",
    preserveSeed: true,
    selectionSeed: "#435ee5",
    successSeed: "#068440",
    warningSeed: "#db5b06",
    dangerSeed: "#dd0e0e",
    // Warm grays #e5e5e0, #91918c, #62625b, #33332e, all at OKLCH h≈107.
    neutralHue: 107,
    lightBg: 100,
    // Dark is pure black, with #33332e menus and dialogs above it.
    darkBg: 0,
    // Fields, checkboxes and radios take #91918c, not the #c8c8c1 dividers.
    controlEdge: "strong",

    // Typography
    // Pin Sans is proprietary; Figtree matches its single-story g and width.
    bodyFont: "Figtree",
    // Headings 700, -0.5px at 28 and 36.
    titleStyle: "bold",

    // Shape
    // Buttons, fields, chips and menus 16 at 48px; dialogs 20, tooltips 8.
    radiusPx: 16,
    roleControl: "lg",
    // Dropdown rows 8 inside 16px flyouts.
    roleItem: "sm",
    // Pins and board covers 16.
    roleCard: "lg",

    // Space
    // Consumer controls are 48 with 16px labels; forms drop to 36.
    density: "touch",

    // Surfaces
    // Menus, dialogs and cards are borderless: 0 3px 12px .2 on overlays,
    // 0 .5px 3px .2 on cards.
    surfaceEdge: "none",
    surfaceShadow: "low",
    // The nav rail sits on the page.
    shellTone: "page",

    // States
    // Fields swap their edge for a 2px blue line.
    focusInputStyle: "border",
    focusInputWeight: "thick",

    // Motion
    // Buttons and chips compress to .99 on press.
    buttonPress: "scale",

    // Buttons
    // #e5e5e0, no edge.
    buttonSecondary: "soft",

    // Toggles
    // Search chips flip to #33332e with white text.
    toggleSelected: "inverse",

    // Selection
    // Stand-in: checkboxes are 8px on 24 (4 on 16); the 16px base's detail
    // rung draws our 16px box as a circle.
    checkCorner: "sharp",
    // Stand-in: the range is gray #74746c under a blue knob; red stays on CTAs.
    sliderColor: "neutral",

    // Segmented control
    // A #33332e segment with white text on a #e5e5e0 track.
    segmentedSelected: "inverse",

    // Inputs
    // Selects are native: a field with a #91918c edge.
    selectTrigger: "field",

    // Menus & popovers
    // No arrows on tooltips or flyouts.
    menuArrows: "none",

    // Dialogs
    // rgba(0, 0, 0, .6) behind the login modal.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "heavy",

    // Navigation
    // Inline links are ink and underlined.
    linkUnderline: "always",
    linkColor: "neutral",
    // A black underline under the current tab's label; labels stay black.
    tabStyle: "line",
    tabIndicator: "label",

    // Feedback
    // "New" is #2b48d4 on #ebeeff, 4px corners.
    badgeStyle: "soft",
    badgeShape: "rounded",
    // Callouts are tinted fills with no edge.
    alertStyle: "soft",
    // Toasts are #494943 with white text.
    toastStyle: "inverse",
    // Progress fills in blue #677eee.
    progressColor: "same-checks",
  },
})

import { definePreset } from "./preset"

export const spotify = definePreset({
  id: "spotify",
  name: "Spotify",
  description: "Vivid green on near-black.",
  swatch: "#1ed760",
  inspiredBy: "Spotify",
  diff: {
    // Color
    // Bright-accent #1ed760 under black ink, verbatim in both themes.
    brand: "#1ed760",
    preserveSeed: true,
    // Encore's light positive; #1ed760 sat at 1.6:1 as an icon on the white dark-mode toast.
    successSeed: "#159542",
    warningSeed: "#ffa42b",
    dangerSeed: "#e91429",
    // Every Encore neutral is R=G=B.
    neutralTint: 0,
    lightBg: 100,
    // background-base #121212 is L* 5.5.
    darkBg: 5.5,
    // Field, checkbox and radio edges are #7c7c7c, far above the #292929 dividers.
    controlEdge: "strong",

    // Typography
    // Spotify Mix is proprietary; Figtree is the closest free geometric grotesk.
    bodyFont: "Figtree",
    titleStyle: "bold",
    // Buttons, chips and tabs are 700.
    labelWeight: "bold",

    // Icons
    // Encore's outline glyphs are lighter than Lucide's 2px.
    iconStroke: 1.5,

    // Shape
    // Base 8 reproduces Encore's 2 / 4 / 6 / 8 ladder: fields 4, rows and cards 6.
    radiusPx: 8,
    roleControl: "sm",
    rolePanel: "lg",

    // Space
    // Controls 32 / 48 / 56px with 16px labels and field values.
    density: "touch",

    // Surfaces
    // Containers step up one gray (#1f1f1f on #121212), no borders, soft drops.
    surfaceLayers: "tonal",
    surfaceEdge: "none",
    surfaceShadow: "low",
    // A #000 frame around 8px-rounded #121212 panels.
    shellTone: "recessed",

    // Browser
    selectionHighlight: "browser",

    // States
    // A 2px white (dark) or black (light) ring drawn inside, never green.
    focusColor: "neutral",
    focusStyle: "inset",
    focusInputStyle: "border",
    focusInputWeight: "thick",
    disabledTreatment: "fade",

    // Motion
    // Overlays fade in while sliding 4px from the trigger side.
    motionEntrance: "slide",

    // Links
    // Inline text links are always underlined.
    linkUnderline: "always",
    linkColor: "neutral",

    // Buttons
    buttonRadius: "pill",
    // Transparent pill on a 1px #7c7c7c edge (Continue with Google, Following).
    buttonSecondary: "outline",
    // Selected filter chips flip to white on black ink (black on white in light).
    toggleSelected: "inverse",
    segmentedSelected: "inverse",

    // Inputs
    // A page-colored box on the edge; Outline tints it #333 in dark.
    inputStyle: "inset",
    // Hover turns the #7c7c7c edge to text-base.
    inputHover: "edge",
    // Labels are 14/700.
    fieldLabel: "semibold",
    selectTrigger: "field",

    // Selection
    // The playback bar is a 4px track (Knob's own Thin) filled white; green only on hover.
    sliderColor: "neutral",
    // Checkbox is a fixed 3px.
    checkCorner: "sharp",
    // No Encore choice card; an edge over a green wash Spotify never paints.
    cardSelected: "outline",

    // Menus & popovers
    // Menus, selects and tooltips never point (Popovers would tip menus too).
    menuArrows: "none",
    tooltipStyle: "surface",

    // Dialogs
    // Plain 70% black scrim, no blur.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "heavy",
    dialogSections: "divided",
    // Close is a filled 32px circle.
    dialogClose: "filled",
    dialogEntrance: "rise",

    // Navigation
    // Subdued 14/700 tab labels; a 2px green bar under the current one.
    tabStyle: "line",
    tabsColor: "accent",
    // The bar sits under the label, inset 12px.
    tabIndicator: "label",
    // Current sidebar items read in ink, no slab (green: the marker shares the tabs color key).
    navMarker: "ink",
    navWeight: "bold",

    // Feedback
    alertStyle: "soft",
    // A white box on the dark app.
    toastStyle: "inverse",
    spinnerStyle: "ring-track",
    // ProgressBar is 6px in essential-bright-accent, the check color.
    progressTrack: "medium",
    progressColor: "same-checks",
    // Tags are 4px; status tags (New, Beta) are solid.
    badgeShape: "rounded",
  },
})

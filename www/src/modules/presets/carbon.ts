import { definePreset } from "./preset"

export const carbon = definePreset({
  id: "carbon",
  name: "Carbon",
  description: "Square, tonal and bottom-lined, IBM blue on gray layers.",
  swatch: "#0f62fe",
  inspiredBy: "IBM Carbon",
  diff: {
    // Assets
    brandAssets: "ibm",

    // Style
    // Field bottom lines are #8d8d8d.
    controlEdge: "strong",

    // Color
    brand: "#0f62fe",
    preserveSeed: true,
    successSeed: "#24a148",
    warningSeed: "#f1c21b",
    dangerSeed: "#da1e28",
    neutralTint: 0,
    // White page, G100 #161616 (L* 7.25).
    lightBg: 100,
    darkBg: 7,
    selectionHighlight: "browser",
    // Checks, radios and the slider are #161616.
    checkboxColor: "neutral",
    radioColor: "neutral",
    sliderColor: "neutral",
    chartPalette: "vivid",

    // Typography
    bodyFont: "IBM Plex Sans",
    // IBM Plex Mono is not in the catalog.
    monoFont: "Source Code Pro",
    titleStyle: "display",
    labelWeight: "normal",

    // Icons
    // Stand-in: Carbon's own icons aren't in the catalog; Lucide at 1.5.
    iconStroke: 1.5,

    // Shape: Square; the checkbox keeps its 2px corner.
    roleControl: "none",
    roleItem: "none",
    roleSurface: "none",
    rolePanel: "none",
    checkCorner: "sharp",
    // Fields md 40, buttons lg 48.
    density: "spacious",

    // Surfaces: #f4f4f4 layers on white, no edges.
    surfaceLayers: "tonal",
    surfaceEdge: "none",
    shellTone: "page",

    // States: a 2px inset focus, white inner stroke on filled buttons.
    focusStyle: "inset",
    focusInputStyle: "ring",

    // Motion: menus and popovers appear with no transform.
    popoverEntrance: "fade",
    tooltipEntrance: "fade",

    // Buttons: #393939 secondary.
    // Toggles select solid: Inverse #1f1f1f barely parts from the #393939 secondary.
    toggleSelected: "solid",
    buttonSecondary: "solid",
    segmentedSelected: "inverse",
    segmentedTrack: "outline",

    // Inputs: a #f4f4f4 field with one bottom line; TextInput has no hover.
    inputStyle: "indicator",
    inputHover: "none",
    inputError: "icon-field",
    selectTrigger: "field",
    otpStyle: "separate",

    // Selection
    radioMark: "ring",
    sliderThumb: "solid",
    sliderTrack: "hairline",
    cardSelected: "outline",

    // Menus & popovers: a tip on tooltips only; Menu and Dropdown draw none.
    menuInset: "full-bleed",
    // Dropdown's selected option: a #e0e0e0 row, its check at the end.
    // Stand-in: Menu's selectable items put the check at the start.
    menuSelectedRow: "tint",
    // Dropdown options are 40px, the field height.
    menuRows: "match",
    mobilePickers: "anchored",

    // Dialogs: a 64px bleed action bar; 60% black scrim files under Heavy.
    dialogBackdrop: "scrim",
    dialogBackdropStrength: "heavy",
    dialogActions: "bleed",
    dialogEntrance: "drop",
    mobileDialogs: "fullscreen",

    // Navigation: a blue bar marks the current tab and nav item.
    tabStyle: "line",
    tabsColor: "accent",
    navMarker: "fill-bar",
    navWeight: "regular-semibold",
    linkUnderline: "hover",
    breadcrumbSeparator: "slash",
    breadcrumbTone: "link",

    // Feedback: inverse notifications and toasts.
    toastStyle: "inverse",
    alertStyle: "inverse",
    badgeStyle: "soft",
    progressTrack: "thick",

    // Data display
    tableHeader: "filled",
    tableHeaderLabel: "strong",
    calendarToday: "dot",
    calendarTodayColor: "selection",
  },
})

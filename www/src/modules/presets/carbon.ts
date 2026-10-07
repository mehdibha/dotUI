import { definePreset } from "./preset"

export const carbon = definePreset({
  id: "carbon",
  name: "Carbon",
  description: "Square, tonal and bottom-lined, IBM blue on gray layers.",
  swatch: "#0f62fe",
  inspiredBy: "IBM Carbon",
  diff: {
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
    // Field bottom lines are #8d8d8d.
    controlEdge: "strong",
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
    motionEntrance: "fade",

    // Buttons: #393939 secondary.
    buttonSecondary: "solid",
    // Tone is excluded under a solid secondary; Inverse #1f1f1f barely parts from #393939.
    toggleSelected: "solid",
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
    menuIndicator: "check-start",
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
    alertStyle: "inverse",
    toastStyle: "inverse",
    badgeStyle: "soft",
    progressTrack: "thick",

    // Data display
    tableHeader: "filled",
    tableHeaderLabel: "strong",
    calendarToday: "dot",
    calendarTodayColor: "selection",
  },
})

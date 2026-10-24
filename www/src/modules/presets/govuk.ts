import { definePreset } from "./preset"

export const govuk = definePreset({
  id: "govuk",
  name: "GOV.UK",
  description: "Square and plain, green actions on a ledge, big type.",
  swatch: "#1d70b8",
  inspiredBy: "GOV.UK Design System",
  diff: {
    // Style: buttons stand on a 2px lip that presses flat; cards and fields stay flat.
    // Stand-in: Chunky's ledge is Duolingo's 4px lip.
    style: "chunky",
    surfaceEdge: "line",
    // Stand-in: the secondary is a #f3f3f3 plate on a #858686 lip with no edge; Ledge's own secondary rims the page fill.
    // Fields, selects, checkboxes and radios: 2px #0b0c0c, the text color.
    controlEdge: "strong",
    controlStroke: "bold",

    // Color
    // Buttons #0f7a52 over a #083d29 lip.
    brand: "#0f7a52",
    preserveSeed: true,
    // The current page and the service navigation bar are link blue #1a65a6.
    selectionSeed: "#1a65a6",
    successSeed: "#0f7a52",
    warningSeed: "#f47738",
    dangerSeed: "#ca3535",
    // Black #0b0c0c and its tints: #484949, #cecece, #f3f3f3.
    neutralTint: 0,
    lightBg: 100,
    // GOV.UK has no dark mode: derived on #0b0c0c, the text black.
    darkBg: 3,
    selectionHighlight: "browser",
    // Ticks and radio dots are #0b0c0c.
    checkboxColor: "neutral",
    radioColor: "neutral",
    switchColor: "neutral",
    sliderColor: "neutral",

    // Typography
    // Stand-in: GDS Transport is licensed to gov.uk only; Arimo is metric-compatible with Arial, its own fallback.
    bodyFont: "Arimo",
    // Headings 48/36/24/19 at 700.
    titleStyle: "bold",
    labelWeight: "normal",

    // Shape: square everywhere (tags round 1px).
    roleControl: "none",
    roleItem: "none",
    roleSurface: "none",
    rolePanel: "none",
    // Fields 40px, buttons 38px over the lip.
    density: "spacious",

    // Surfaces: no app shell; summary cards draw a 1px #cecece line, no shadow.
    shellTone: "page",

    // States
    // Stand-in: focus is #ffdd00 yellow (a fill on buttons and links, a 3px outline on fields) over a black bar; ours draws ink.
    focusColor: "neutral",
    focusStyle: "halo",
    focusStrength: "solid",
    focusWidth: 3,
    focusInputStyle: "ring",
    // Disabled buttons and fields at 50% opacity.
    disabledTreatment: "fade",

    // Motion: govuk-frontend sets no transitions or animations.
    motion: "none",

    // Buttons
    // Pagination: the current page is #1a65a6 under white 700 numerals; Solid reads the selection seed.
    paginationCurrent: "selected",
    toggleSelected: "solid",

    // Selection
    // Checked radios keep their white ring around a 20px dot.
    radioMark: "ring",
    // Inferred: GOV.UK has no choice cards; a clear box in an edge, like its fields.
    cardSelected: "outline",

    // Inputs: a clear box in a 2px black edge, no hover.
    inputStyle: "outline",
    // Native selects: the field's 2px black box.
    selectTrigger: "field",

    // Dialogs: GOV.UK has no modal; a plain scrim, no blur.
    dialogBackdrop: "scrim",

    // Navigation
    // Tabs: #f3f3f3 plates, the current one white inside a 1px #cecece line.
    segmentedSelected: "ring",
    // Tabs and service navigation links at 400, current or not.
    navWeight: "regular",
    // The current service navigation item: a 5px #1a65a6 bar.
    navMarker: "bar",
    // Stand-in: links are #1a65a6 at 400. Blue isn't reachable under the green brand; underlined ink reads closer than green.
    linkUnderline: "always",
    linkColor: "neutral",
    // Breadcrumbs are underlined #0b0c0c links.
    breadcrumbTone: "link",

    // Feedback
    // Notification banners: a 5px #1d70b8 frame and title band over a white body.
    alertStyle: "outline",
    skeletonAnimation: "none",

    // Data display
    // Tags: #d2e2f1 under #0f385c, grey #cecece under #0b0c0c, 19/400.
    badgeStyle: "soft",
    badgeShape: "rounded",
    // Bold #0b0c0c headers over 1px #cecece row rules.
    tableHeaderLabel: "strong",
    // Summary cards: a #f3f3f3 title band.
    cardHeader: "band",
  },
})

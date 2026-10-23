import { definePreset } from "./preset"

export const vercel = definePreset({
  id: "vercel",
  name: "Vercel",
  description: "Monochrome ink, Geist blue accents.",
  swatch: "#8f8f8f",
  inspiredBy: "Vercel",
  diff: {
    // Assets
    brandAssets: "vercel",

    // Color
    // Geist blue-700 inks links, focus, switch, slider and choice cards; solids stay ink.
    // Stand-in: dark mode keeps it; Geist lifts focus and links to #52a8ff.
    brand: "#0072f5",
    preserveSeed: true,
    buttonColor: "neutral",
    selectionColor: "neutral",
    // Success is blue in Geist (Note, Toast); green is palette only.
    successSeed: "#0072f5",
    // amber-700: the 800 fill (#ff990a) darkens and loses its black label in the engine.
    warningSeed: "#ffb224",
    // red-800, the fill Geist paints error buttons and toasts with.
    dangerSeed: "#da2f35",
    // Stand-in: the engine's ink and muted text sit a step lighter than
    // gray-1000 #171717 / #ededed and gray-900 #4d4d4d / #a1a1a1.
    neutralTint: 0,
    // background-200: #fafafa page, #000 in dark.
    lightBg: 98.5,
    darkBg: 0,
    // Fields and outline buttons wear the gray-alpha-400 hairline (#ebebeb / #2e2e2e).
    controlEdge: "soft",

    // Typography
    // Headings 600 with negative tracking. Stand-in: Geist tightens more as
    // size grows (heading-24 is -0.96px; ours -0.6px).
    titleStyle: "tight",

    // Icons
    // Geist Icons are proprietary; Lucide at their 1.5/16 line weight.
    iconStroke: 2.25,

    // Shape
    // Base 8: controls 6, checks 4, menus and modals 12.
    radiusPx: 8,
    roleItem: "md",
    roleSurface: "xl",
    roleCard: "md",

    // Space
    // 32/36/40 controls, 36px menu rows.
    density: "comfortable",

    // Surfaces
    // White background-100 cards on the #fafafa shell. Stand-in: in dark,
    // menus, dialogs and ⌘K sit a step above Geist's #0a0a0a.
    surfaceLayers: "grouped",
    shellTone: "page",

    // States
    // Fields focus with a 1px edge at 34% black and a 4px halo at 16%.
    focusInputWeight: "thick",
    focusInputColor: "neutral",
    invalidStyle: "halo",

    // Motion
    // Menus fade in without zooming.
    popoverEntrance: "fade",
    tooltipEntrance: "fade",

    // Buttons
    // Stand-in: Geist fills secondary buttons, fields, checks and kbd with
    // background-100 (#fff / #0a0a0a); ours stay clear over the page.
    buttonSecondary: "outline",
    // Stand-in: Geist's segmented switch is 36px with 28px items at 500 and a
    // flat gray-100 chip; ours follows the density, the tab weight and a shadowed chip.
    segmentedTrack: "outline",

    // Selection
    checkboxColor: "neutral",
    // Checks wear gray-700 (#8f8f8f), stronger than the field edge.
    checkEdge: "strong",
    radioColor: "neutral",
    radioMark: "ring",
    // Blue choice cards beside black checks.
    cardSelected: "outline-tint",
    cardColor: "accent",
    sliderTrack: "medium",
    // Stand-in: switches keep our 24px track; Geist's is 28×14.

    // Inputs
    inputHover: "edge",
    inputError: "icon-message",
    selectTrigger: "field",
    // Stand-in: Geist labels are 13px in gray-900; ours 14px in ink.

    // Menus & popovers
    menuRows: "match",
    // The command input is bare text over a hairline, no magnifier.
    // Stand-in: Geist's ⌘K is 640px wide with an 18px prompt.
    menuSearch: "prompt",
    // Stand-in: tooltips keep our 12px text and 12px padding; Geist's are 13px and 8px.

    // Dialogs
    // #f2f2f2 at 80%, no blur.
    dialogBackdrop: "wash",
    dialogBackdropStrength: "heavy",
    dialogSections: "footer-band",
    dialogActions: "spread",
    mobileDialogs: "sheet",

    // Navigation
    // Stand-in: Geist's tabs are 50px tall with 2px side padding; ours 35px and 8px.
    tabStyle: "line",
    // Tabs and sidebar items stay 400 at rest and when current.
    // Stand-in: Geist's sidebar rows are 36px; ours 32px.
    navWeight: "regular",
    // Dashboard links are blue with no underline; only links inside notes have one.
    linkUnderline: "hover",

    // Feedback
    // Stand-in: Geist notes and segmented tracks take the 6px control radius
    // and notes set muted text; ours take the 12px container radius and ink.
    alertStyle: "outline",
    toastStatus: "bold",
    spinnerStyle: "blades",
    // Stand-in: Geist's bar is 10px with a rounded fill end; ours 8px, cut square.
    progressTrack: "thick",
    // Dashboard badges are the subtle kind: a gray or blue tint with colored
    // text. Stand-in: ours are 20px; Geist's are 24px with 12px padding.
    badgeStyle: "soft",

    // Data display
    // Stand-in: Geist keys are 400 on a filled plate; ours 500, clear.
    kbdTreatment: "outline",
    cardFooter: "band",
  },
})

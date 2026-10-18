export interface ComponentInfo {
  name: string
  slug: string
  /** Scale the preview down (default 1 — native size). Set only on demos too
   *  large for the card stage (calendars, tables, the command palette…). */
  scale?: number
  /** Render the demo full-bleed (overlay scenes manage their own framing and
   *  crop at the card's bottom edge) instead of the default centered + scaled preview. */
  fill?: boolean
  /** Render the demo full-width (responsive, not scaled) — for field-like demos
   *  that should share one consistent, responsive width. */
  stretch?: boolean
}

export interface ComponentCategory {
  title: string
  slug: string
  components: ComponentInfo[]
}

export const componentsData: ComponentCategory[] = [
  {
    title: "Buttons",
    slug: "buttons",
    components: [
      { name: "Button", slug: "button" },
      { name: "ToggleButton", slug: "toggle-button" },
      { name: "ToggleButtonGroup", slug: "toggle-button-group" },
      { name: "SegmentedControl", slug: "segmented-control" },
      { name: "FileTrigger", slug: "file-trigger" },
      { name: "DropZone", slug: "drop-zone" },
      { name: "Group", slug: "group" },
    ],
  },
  {
    title: "Inputs, controls and form",
    slug: "inputs",
    components: [
      { name: "Input", slug: "input", stretch: true },
      { name: "TextArea", slug: "text-area", stretch: true },
      { name: "InputGroup", slug: "input-group", stretch: true },
      { name: "TextField", slug: "text-field", stretch: true },
      { name: "TokenField", slug: "token-field", stretch: true },
      { name: "SearchField", slug: "search-field", stretch: true },
      { name: "NumberField", slug: "number-field" },
      { name: "OTPField", slug: "otp-field" },
      { name: "Checkbox", slug: "checkbox" },
      { name: "CheckboxGroup", slug: "checkbox-group", scale: 0.8 },
      { name: "RadioGroup", slug: "radio-group" },
      { name: "Switch", slug: "switch" },
      { name: "Slider", slug: "slider", stretch: true },
      { name: "Field", slug: "field", stretch: true },
    ],
  },
  {
    title: "Pickers",
    slug: "pickers",
    components: [
      { name: "Menu", slug: "menu" },
      { name: "Combobox", slug: "combobox", fill: true },
      { name: "Mention", slug: "mention", fill: true },
      { name: "Select", slug: "select" },
    ],
  },
  {
    title: "Dates",
    slug: "dates",
    components: [
      { name: "Calendar", slug: "calendar", fill: true },
      { name: "DateField", slug: "date-field", stretch: true },
      { name: "DatePicker", slug: "date-picker", fill: true },
      { name: "TimeField", slug: "time-field", stretch: true },
      { name: "TimePicker", slug: "time-picker", fill: true },
    ],
  },
  {
    title: "Feedback",
    slug: "feedback",
    components: [
      { name: "Alert", slug: "alert", scale: 0.75 },
      { name: "ProgressBar", slug: "progress-bar", stretch: true },
      { name: "Toast", slug: "toast", scale: 0.8 },
      { name: "Loader", slug: "loader" },
      { name: "Skeleton", slug: "skeleton" },
    ],
  },
  {
    title: "Collections",
    slug: "collections",
    components: [
      { name: "ListBox", slug: "list-box", scale: 0.95 },
      { name: "Tree", slug: "tree" },
      { name: "TagGroup", slug: "tag-group" },
    ],
  },
  {
    title: "Navigation",
    slug: "navigation",
    components: [
      { name: "Link", slug: "link" },
      { name: "Tabs", slug: "tabs" },
      { name: "Breadcrumbs", slug: "breadcrumbs" },
      { name: "Command", slug: "command", fill: true },
      { name: "Pagination", slug: "pagination", scale: 0.85 },
      { name: "Sidebar", slug: "sidebar", fill: true },
    ],
  },
  {
    title: "Data display",
    slug: "data-display",
    components: [
      { name: "Accordion", slug: "accordion" },
      { name: "Collapsible", slug: "collapsible" },
      { name: "Avatar", slug: "avatar" },
      { name: "Kbd", slug: "kbd" },
      { name: "Badge", slug: "badge" },
      { name: "Table", slug: "table", scale: 0.5 },
      { name: "Card", slug: "card", scale: 0.75 },
      { name: "Separator", slug: "separator" },
      { name: "Empty", slug: "empty", scale: 0.65 },
      { name: "QRCode", slug: "qr-code" },
    ],
  },
  {
    title: "Chat",
    slug: "chat",
    components: [
      { name: "Message", slug: "message" },
      { name: "Bubble", slug: "bubble" },
      { name: "Attachment", slug: "attachment" },
      { name: "MessageScroller", slug: "message-scroller", scale: 0.8 },
      { name: "Questionnaire", slug: "questionnaire", scale: 0.8 },
      { name: "Marker", slug: "marker", stretch: true },
    ],
  },
  {
    title: "Colors",
    slug: "colors",
    components: [
      { name: "ColorArea", slug: "color-area", scale: 0.7 },
      { name: "ColorField", slug: "color-field", stretch: true },
      { name: "ColorPicker", slug: "color-picker", fill: true },
      { name: "ColorEditor", slug: "color-editor", scale: 0.6 },
      { name: "ColorSlider", slug: "color-slider" },
      { name: "ColorSwatchPicker", slug: "color-swatch-picker" },
      { name: "ColorSwatch", slug: "color-swatch" },
    ],
  },
  {
    title: "Overlays",
    slug: "overlays",
    components: [
      { name: "Modal", slug: "modal", fill: true },
      { name: "Popover", slug: "popover" },
      { name: "Drawer", slug: "drawer", fill: true },
      { name: "Tooltip", slug: "tooltip" },
    ],
  },
  {
    title: "Charts",
    slug: "charts",
    components: [
      { name: "Bar Chart", slug: "chart-bar" },
      { name: "Line Chart", slug: "chart-line" },
      { name: "Area Chart", slug: "chart-area" },
      { name: "Pie Chart", slug: "chart-pie" },
      { name: "Radar Chart", slug: "chart-radar" },
      { name: "Radial Chart", slug: "chart-radial" },
      { name: "Heatmap", slug: "chart-heatmap" },
    ],
  },
]

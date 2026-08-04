"use client"

/* Control Lab — the catalog of the row language: every primitive in rows.tsx
   on its own, with the variants that matter, read top to bottom. The panel
   itself lives in panel-lab; this is the vocabulary it's assembled from, so
   each entry is the control alone rather than a composed panel.

   Each demo owns its state (local in, callback out) and sits in a
   panel-width card, because that's the only context these rows are designed
   for — a 360px column. */

import { useMemo, useState } from "react"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  GrabIcon,
  MonitorIcon,
  MoonIcon,
  MousePointer2Icon,
  PointerIcon,
  SunIcon,
  TextCursorIcon,
} from "lucide-react"
import { useTheme } from "starter-themes"

import { createTheme, STEPS, toOklch } from "@dotui/colors"

import { DEFAULT_BODY_FAMILY } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { TOCItems, TOCProvider } from "@/modules/docs/toc"
import type { TOCItemType } from "@/modules/docs/toc"
import { InternalHeader } from "@/modules/internal/shell"

import {
  ActionRow,
  ColorPickerRow,
  ComponentRow,
  ControlGroup,
  DisclosureRow,
  DrillInRow,
  FontPickerRow,
  GroupCaption,
  MiniSegmented,
  MiniSwitch,
  NeutralPickerRow,
  ParamRow,
  SectionHeader,
  SegmentedRow,
  SelectRow,
  SliderRow,
  StepperRow,
  OptionGridRow,
  SwitchRow,
} from "./rows"
import type {
  NeutralValue,
  SegmentedRowOption,
  OptionGridItem,
  SelectRowOption,
} from "./rows"

/* ------------------------------ Mini specimens ----------------------------- */

/* Specimens mirror the real components at their default size (density
   default, size md) — spans, not real controls: a button can't nest in the
   card's toggle button. */
function MiniButton({ className }: { className: string }) {
  return (
    <span
      className={`flex h-8 items-center rounded-(--btn-radius) px-2.5 text-sm font-medium ${className}`}
    >
      Button
    </span>
  )
}

function MiniInput({ className }: { className: string }) {
  return (
    <span
      className={`flex h-8 w-full min-w-0 items-center px-2.5 text-sm text-fg-muted ${className}`}
    >
      Value
    </span>
  )
}

const BUTTON_STYLES: OptionGridItem[] = [
  {
    id: "solid",
    label: "Solid",
    preview: <MiniButton className="bg-primary text-fg-on-primary" />,
  },
  {
    id: "soft",
    label: "Soft",
    preview: <MiniButton className="bg-neutral text-fg-on-neutral" />,
  },
  {
    id: "outline",
    label: "Outline",
    preview: <MiniButton className="border border-border-field text-fg" />,
  },
  { id: "quiet", label: "Quiet", preview: <MiniButton className="text-fg" /> },
]

const INPUT_STYLES: OptionGridItem[] = [
  {
    id: "outline",
    label: "Outline",
    preview: (
      <MiniInput className="rounded-(--input-radius) border border-border-field bg-field" />
    ),
  },
  {
    id: "line",
    label: "Line",
    preview: <MiniInput className="border-b border-border-field" />,
  },
  {
    id: "filled",
    label: "Filled",
    preview: <MiniInput className="rounded-(--input-radius) bg-neutral" />,
  },
  {
    id: "filled-line",
    label: "Filled line",
    preview: (
      <MiniInput className="rounded-t-(--input-radius) border-b border-border-field bg-neutral" />
    ),
  },
]

const RADIUS_OPTIONS: SegmentedRowOption[] = [
  { value: "sharp", label: "Sharp" },
  { value: "md", label: "Md" },
  { value: "pill", label: "Pill" },
]

const ALIGN_OPTIONS: SegmentedRowOption[] = [
  { value: "left", label: <AlignLeftIcon />, ariaLabel: "Align left" },
  { value: "center", label: <AlignCenterIcon />, ariaLabel: "Align center" },
  { value: "right", label: <AlignRightIcon />, ariaLabel: "Align right" },
]

const TRACKING_OPTIONS: SegmentedRowOption[] = [
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
]

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
  { value: "system", label: "System", icon: <MonitorIcon /> },
]

const CURSOR_OPTIONS = ["default", "pointer", "grab", "text"].map((c) => ({
  value: c,
  label: c,
}))

/* The grid layout earns its keep when the option is a look, not a name: each
   card draws the cursor it stands for. */
const CURSOR_GRID_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", icon: <MousePointer2Icon /> },
  { value: "pointer", label: "Pointer", icon: <PointerIcon /> },
  { value: "grab", label: "Grab", icon: <GrabIcon /> },
  { value: "text", label: "Text", icon: <TextCursorIcon /> },
]

/* --------------------------------- Catalog --------------------------------- */

interface Entry {
  id: string
  name: string
  description: string
  variants: { label: string; render: React.ReactNode }[]
}

interface Group {
  id: string
  title: string
  /** One line on what belongs in the group — and what doesn't. */
  blurb: string
  entries: Entry[]
}

/**
 * How a demo is framed. `card` is the honest one — panel width on a panel
 * card, the only context these rows actually ship in. `bare` drops the chrome
 * to judge the control alone, and `wide` stretches it past the panel column,
 * which is where a row that only works at 360px gives itself away.
 */
type PreviewMode = "card" | "bare" | "wide"

const PREVIEW_MODES: SegmentedRowOption[] = [
  { value: "card", label: "Card" },
  { value: "bare", label: "Bare" },
  { value: "wide", label: "Wide" },
]

function Stage({
  mode,
  children,
}: {
  mode: PreviewMode
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        mode === "wide" ? "w-full min-w-[360px]" : "w-[360px] shrink-0",
        mode === "card" && "rounded-xl border border-border/45 bg-card p-3",
      )}
    >
      {children}
    </div>
  )
}

function SelectDemo({
  withIcons,
  described,
}: {
  withIcons?: boolean
  described?: boolean
}) {
  const [value, setValue] = useState(withIcons ? "system" : "pointer")
  return (
    <SelectRow
      label={withIcons ? "Theme" : "Cursor"}
      description={
        described ? "The pointer shown over anything interactive." : undefined
      }
      value={value}
      onChange={setValue}
      options={withIcons ? THEME_OPTIONS : CURSOR_OPTIONS}
    />
  )
}

function SelectGridDemo() {
  const [value, setValue] = useState("default")
  return (
    <SelectRow
      label="Cursor"
      value={value}
      onChange={setValue}
      options={CURSOR_GRID_OPTIONS}
      layout="grid"
    />
  )
}

function ColorDemo({ described }: { described?: boolean }) {
  const [value, setValue] = useState("#635BFF")
  return (
    <ColorPickerRow
      label="Brand"
      description={
        described
          ? "Seeds the accent scale and every solid built on it."
          : undefined
      }
      value={value}
      onChange={setValue}
    />
  )
}

function ColorTilesDemo() {
  const [brand, setBrand] = useState("#635BFF")
  const [danger, setDanger] = useState("#E5484D")
  return (
    <div className="grid grid-cols-2 gap-2">
      <ColorPickerRow
        layout="tile"
        label="Brand"
        value={brand}
        onChange={setBrand}
      />
      <ColorPickerRow
        layout="tile"
        label="Danger"
        value={danger}
        onChange={setDanger}
      />
    </div>
  )
}

const DEMO_BRAND = "#635BFF"

function NeutralDemo() {
  const { resolvedTheme } = useTheme()
  const [value, setValue] = useState<NeutralValue>({ hue: null, tint: 1 })

  // The preview is the engine's own output for these two inputs, in the mode
  // you're looking at — the row never guesses what the gray will become.
  const ramp = useMemo(() => {
    const theme = createTheme({
      seeds: { accent: DEMO_BRAND },
      neutralHue: value.hue ?? undefined,
      neutralTint: value.tint,
    })
    const mode = resolvedTheme === "dark" ? theme.dark : theme.light
    return STEPS.map((step) => mode.scales.neutral?.[step] ?? mode.background)
  }, [value, resolvedTheme])

  return (
    <NeutralPickerRow
      value={value}
      onChange={setValue}
      brandHue={toOklch(DEMO_BRAND).h}
      ramp={ramp}
    />
  )
}

function FontDemo({
  mono,
  described,
}: {
  mono?: boolean
  described?: boolean
}) {
  const [value, setValue] = useState(mono ? "Geist Mono" : DEFAULT_BODY_FAMILY)
  return (
    <FontPickerRow
      label={mono ? "Mono" : "Body"}
      description={
        described
          ? "Used for body copy, labels and every UI string."
          : undefined
      }
      categories={mono ? ["mono"] : ["sans-serif", "serif"]}
      selectedKey={value}
      onChange={setValue}
    />
  )
}

function SliderDemo({
  selfDemo,
  described,
}: {
  selfDemo?: boolean
  described?: boolean
}) {
  const [value, setValue] = useState(selfDemo ? 1 : 0.5)
  return selfDemo ? (
    <SliderRow
      label="Radius"
      value={value}
      onChange={setValue}
      minValue={0}
      maxValue={2}
      step={0.05}
      format={(v) => `${v.toFixed(2)}×`}
      trackStyle={{ borderRadius: `${4 + value * 10}px` }}
    />
  ) : (
    <SliderRow
      label="Opacity"
      description={
        described ? "How see-through disabled controls look." : undefined
      }
      value={value}
      onChange={setValue}
    />
  )
}

function SwitchDemo({ described }: { described?: boolean }) {
  const [value, setValue] = useState(true)
  return (
    <SwitchRow
      label="Translucent menus"
      description={
        described
          ? "Menus, popovers and dropdowns blur whatever sits behind them."
          : undefined
      }
      value={value}
      onChange={setValue}
    />
  )
}

function SegmentedDemo({
  icons,
  described,
}: {
  icons?: boolean
  described?: boolean
}) {
  const [value, setValue] = useState(icons ? "center" : "md")
  return (
    <SegmentedRow
      label={icons ? "Align" : "Radius"}
      description={
        described ? "Applies to buttons, inputs, cards and menus." : undefined
      }
      value={value}
      onChange={setValue}
      options={icons ? ALIGN_OPTIONS : RADIUS_OPTIONS}
    />
  )
}

function StepperDemo({ described }: { described?: boolean }) {
  const [value, setValue] = useState(16)
  return (
    <StepperRow
      label="Base size"
      description={
        described ? "Every other size scales from this one." : undefined
      }
      value={value}
      onChange={setValue}
      minValue={10}
      maxValue={24}
      unit="px"
    />
  )
}

function OptionGridDemo({
  columns,
  described,
  plain,
}: {
  columns: number
  described?: boolean
  plain?: boolean
}) {
  const [value, setValue] = useState(columns === 1 ? "outline" : "solid")
  return (
    <OptionGridRow
      label={columns === 1 ? "Input" : "Button"}
      description={
        described
          ? "Pick by look: each card renders the style itself."
          : undefined
      }
      value={value}
      onChange={setValue}
      options={columns === 1 ? INPUT_STYLES : BUTTON_STYLES}
      columns={columns}
      variant={plain ? "plain" : undefined}
    />
  )
}

function ComponentRowDemo({
  withParams,
  described,
}: {
  withParams?: boolean
  described?: boolean
}) {
  const [style, setStyle] = useState("solid")
  const [radius, setRadius] = useState("md")
  const [lift, setLift] = useState(true)
  return (
    // No DisclosureGroup: the group owns expansion state, so `defaultExpanded`
    // on a child is ignored inside one. The panel wraps these in a group so
    // only one opens at a time; a lone demo doesn't need that.
    <>
      <ComponentRow
        name="Button"
        description={
          described
            ? "Shared with ToggleButton — the pair stays in sync."
            : undefined
        }
        value={style}
        onChange={setStyle}
        options={BUTTON_STYLES}
        columns={2}
        defaultExpanded={withParams}
      >
        {withParams && (
          <>
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Button radius"
                value={radius}
                onChange={setRadius}
                options={RADIUS_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Lift on hover">
              <MiniSwitch
                ariaLabel="Lift on hover"
                value={lift}
                onChange={setLift}
              />
            </ParamRow>
          </>
        )}
      </ComponentRow>
    </>
  )
}

function DisclosureDemo({
  withValue,
  described,
  inset,
}: {
  withValue?: boolean
  described?: boolean
  inset?: boolean
}) {
  const [tracking, setTracking] = useState("normal")
  const [size, setSize] = useState(16)
  return (
    <DisclosureRow
      label="Body text"
      description={
        described ? "Every UI string that isn’t a heading." : undefined
      }
      value={withValue ? "Inter" : undefined}
      inset={inset}
      defaultExpanded
    >
      <SegmentedRow
        label="Tracking"
        value={tracking}
        onChange={setTracking}
        options={TRACKING_OPTIONS}
      />
      <StepperRow
        label="Size"
        value={size}
        onChange={setSize}
        minValue={10}
        maxValue={24}
        unit="px"
      />
    </DisclosureRow>
  )
}

function GroupDemo({ caption }: { caption?: boolean }) {
  const [brand, setBrand] = useState("#635BFF")
  const [radius, setRadius] = useState("md")
  const [translucent, setTranslucent] = useState(false)
  return (
    <>
      <ControlGroup>
        <ColorPickerRow label="Brand" value={brand} onChange={setBrand} />
        <SegmentedRow
          label="Radius"
          value={radius}
          onChange={setRadius}
          options={RADIUS_OPTIONS}
        />
        <SwitchRow
          label="Translucent"
          value={translucent}
          onChange={setTranslucent}
        />
      </ControlGroup>
      {caption && (
        <GroupCaption>
          One family sets the card, control and overlay shadows together.
        </GroupCaption>
      )}
    </>
  )
}

function HeaderDemo({ modified }: { modified?: boolean }) {
  const [isModified, setModified] = useState(Boolean(modified))
  const [value, setValue] = useState(modified ? "pill" : "md")
  return (
    <>
      <SectionHeader
        label="Shape"
        modified={isModified}
        onReset={() => {
          setModified(false)
          setValue("md")
        }}
      />
      <SegmentedRow
        label="Radius"
        value={value}
        onChange={(next) => {
          setValue(next)
          setModified(true)
        }}
        options={RADIUS_OPTIONS}
      />
    </>
  )
}

function ParamRowDemo() {
  const [radius, setRadius] = useState("md")
  const [on, setOn] = useState(true)
  return (
    <div className="rounded-xl bg-muted py-1">
      <ParamRow label="Radius">
        <MiniSegmented
          ariaLabel="Radius"
          value={radius}
          onChange={setRadius}
          options={RADIUS_OPTIONS}
        />
      </ParamRow>
      <ParamRow label="Shadow">
        <MiniSwitch ariaLabel="Shadow" value={on} onChange={setOn} />
      </ParamRow>
    </div>
  )
}

/* Primitives first, ordered as the panel is built up: the rows that hold one
   value, then the rows that do something instead of holding one, then the
   containers — they only make sense once there are rows to put in them. */
const GROUPS: Group[] = [
  {
    id: "primitives",
    title: "Primitives",
    blurb:
      "One control each, in the row shape the whole panel is built from: label left, control right, sized for a 360px column.",
    entries: [
      {
        id: "switch-row",
        name: "SwitchRow",
        description:
          "A switch shaped as a row: the whole pill toggles. An optional description carries the axes whose name isn’t enough — the row grows to fit it.",
        variants: [
          { label: "Default", render: <SwitchDemo /> },
          { label: "With description", render: <SwitchDemo described /> },
        ],
      },
      {
        id: "segmented-row",
        name: "SegmentedRow",
        description:
          "Joined pills for a small, mutually exclusive set. Icon-only segments must carry an ariaLabel.",
        variants: [
          { label: "Text", render: <SegmentedDemo /> },
          { label: "Icons", render: <SegmentedDemo icons /> },
          { label: "With description", render: <SegmentedDemo described /> },
        ],
      },
      {
        id: "select-row",
        name: "SelectRow",
        description:
          "A listbox trigger shaped as a settings row: label left, value and chevrons right. Options may carry a glyph, shown in both trigger and list. The grid layout swaps the list for illustrated cards — artwork on top, label below — for options that are looks rather than names.",
        variants: [
          { label: "Default", render: <SelectDemo /> },
          { label: "With icons", render: <SelectDemo withIcons /> },
          { label: "With description", render: <SelectDemo described /> },
          { label: "Grid, illustrated", render: <SelectGridDemo /> },
        ],
      },
      {
        id: "slider-row",
        name: "SliderRow",
        description:
          "A full-bleed slider: the entire pill is the drag surface, label and value float on top, and the fill reads as row progress.",
        variants: [
          { label: "Default", render: <SliderDemo /> },
          { label: "Self-demoing track", render: <SliderDemo selfDemo /> },
          { label: "With description", render: <SliderDemo described /> },
        ],
      },
      {
        id: "stepper-row",
        name: "StepperRow",
        description:
          "A numeric stepper as a row: label left, − value + right, with an optional unit.",
        variants: [
          { label: "Default", render: <StepperDemo /> },
          { label: "With description", render: <StepperDemo described /> },
        ],
      },
      {
        id: "color-picker-row",
        name: "ColorPickerRow",
        description:
          "A color seed as a row: hex on the right beside its swatch, opening a picker anchored to the trigger — preset seeds, area, hue, hex. The neutral gets its own picker: a gray is a direction and an amount, not a point in a spectrum, so it offers those two axes and previews the scale they resolve to.",
        variants: [
          { label: "Brand", render: <ColorDemo /> },
          { label: "Neutral", render: <NeutralDemo /> },
          { label: "With description", render: <ColorDemo described /> },
          { label: "Tiles, two up", render: <ColorTilesDemo /> },
        ],
      },
      {
        id: "font-picker-row",
        name: "FontPickerRow",
        description:
          "A searchable font trigger — the family is set in its own typeface on the right, so the row doubles as a specimen.",
        variants: [
          { label: "Body", render: <FontDemo /> },
          { label: "Mono", render: <FontDemo mono /> },
          { label: "With description", render: <FontDemo described /> },
        ],
      },
      {
        id: "option-grid-row",
        name: "OptionGridRow",
        description:
          "A row whose body is a grid of selectable cards, each rendering its option as a mini specimen — pick by look, not by name. Nothing style-specific about it: shadows, densities and loaders use the same grid.",
        variants: [
          { label: "1 column", render: <OptionGridDemo columns={1} /> },
          { label: "2 columns", render: <OptionGridDemo columns={2} /> },
          { label: "Plain", render: <OptionGridDemo columns={2} plain /> },
          {
            label: "With description",
            render: <OptionGridDemo columns={2} described />,
          },
        ],
      },
      {
        id: "action-row",
        name: "ActionRow",
        description:
          "A verb as a row: centered label, accent for actions, danger for destructive.",
        variants: [
          {
            label: "Default",
            render: <ActionRow label="Add color" onPress={() => {}} />,
          },
          {
            label: "Destructive",
            render: (
              <ActionRow label="Delete system" destructive onPress={() => {}} />
            ),
          },
        ],
      },
      {
        id: "drill-in-row",
        name: "DrillInRow",
        description:
          "A navigation row: label left, current value and chevron right, pushing a sub-panel. Depth lives here; the accordion handles breadth.",
        variants: [
          {
            label: "Default",
            render: (
              <ControlGroup>
                <DrillInRow
                  label="Semantic colors"
                  value="5"
                  onPress={() => {}}
                />
                <DrillInRow label="Charts" value="Default" onPress={() => {}} />
              </ControlGroup>
            ),
          },
          {
            label: "With description",
            render: (
              <ControlGroup>
                <DrillInRow
                  label="Semantic colors"
                  description="Success, warning, danger and info scales."
                  value="5"
                  onPress={() => {}}
                />
                <DrillInRow
                  label="Charts"
                  description="Categorical, sequential and diverging palettes."
                  value="Default"
                  onPress={() => {}}
                />
              </ControlGroup>
            ),
          },
        ],
      },
      {
        id: "disclosure-row",
        name: "DisclosureRow",
        description:
          "A row that opens in place: label left, current value and chevron right, its own rows inside. Where DrillInRow pushes a sub-panel, this one unfolds — depth without leaving the page.",
        variants: [
          { label: "Default", render: <DisclosureDemo /> },
          { label: "With value", render: <DisclosureDemo withValue /> },
          { label: "With description", render: <DisclosureDemo described /> },
          { label: "Inset", render: <DisclosureDemo withValue inset /> },
        ],
      },
      {
        id: "section-header",
        name: "SectionHeader",
        description:
          "A section marker: quiet uppercase label, a dot once the section is touched, and reset on the right. Change the radius below to see it arm.",
        variants: [
          { label: "Default", render: <HeaderDemo /> },
          { label: "Modified", render: <HeaderDemo modified /> },
        ],
      },
      {
        id: "control-group",
        name: "ControlGroup",
        description:
          "Fuses adjacent rows into one card: shared surface, hairline separators, only the group’s corners round. Rows opt in by carrying data-row.",
        variants: [
          { label: "Default", render: <GroupDemo /> },
          { label: "With caption", render: <GroupDemo caption /> },
        ],
      },
    ],
  },
  {
    id: "compositions",
    title: "Compositions",
    blurb:
      "Not new controls — primitives assembled into the shapes the panel actually ships: a grid inside a disclosure, mini controls inside a sub-row.",
    entries: [
      {
        id: "component-row",
        name: "ComponentRow",
        description:
          "A component’s entry in the panel: a collapsed pill showing its current style, expanding in place to the grid plus its params. The answer to “inline grid vs popover” at 20+ components.",
        variants: [
          { label: "Collapsed", render: <ComponentRowDemo /> },
          {
            label: "Expanded, with params",
            render: <ComponentRowDemo withParams />,
          },
          { label: "With description", render: <ComponentRowDemo described /> },
        ],
      },
      {
        id: "param-row",
        name: "ParamRow",
        description:
          "A quiet sub-row for inside an expanded component: label left, a mini control right. Pairs with MiniSegmented and MiniSwitch.",
        variants: [{ label: "Default", render: <ParamRowDemo /> }],
      },
    ],
  },
]

/* ---------------------------------- Page ----------------------------------- */

const TOC_ITEMS: TOCItemType[] = GROUPS.flatMap((group) => [
  { url: `#${group.id}`, title: group.title, depth: 2 },
  ...group.entries.map((entry) => ({
    url: `#${entry.id}`,
    title: entry.name,
    depth: 3,
  })),
])

export function ControlLab() {
  const [preview, setPreview] = useState<PreviewMode>("card")

  return (
    <TOCProvider toc={TOC_ITEMS}>
      <div className="flex min-h-svh flex-col gap-8 px-8 py-10">
        <InternalHeader
          crumbs={[
            { label: "Panel Lab", href: "/internal/panel-lab" },
            { label: "Control Lab" },
          ]}
          title="Control Lab"
          description="The row language the panel is built from — one visual grammar (compact row, label left, control right) applied to every interaction model. Each control on its own, with the variants that matter."
        />

        <div className="flex items-start gap-12">
          <div className="flex min-w-0 flex-1 flex-col gap-16 pb-16">
            {GROUPS.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="flex scroll-mt-10 flex-col gap-10"
              >
                <div className="flex max-w-lg flex-col gap-1 border-b border-border/45 pb-3">
                  <h2 className="text-sm font-medium text-fg">{group.title}</h2>
                  <p className="text-xs/relaxed text-pretty text-fg-muted">
                    {group.blurb}
                  </p>
                </div>
                {group.entries.map((entry) => (
                  <section
                    key={entry.id}
                    id={entry.id}
                    className="flex scroll-mt-10 flex-col gap-4"
                  >
                    <div className="flex max-w-lg flex-col gap-1">
                      <h3 className="font-mono text-[0.8125rem] font-medium text-fg">
                        {entry.name}
                      </h3>
                      <p className="text-xs/relaxed text-pretty text-fg-muted">
                        {entry.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex items-start gap-5",
                        // Wide gives each variant the full column, so they stack.
                        preview === "wide" ? "flex-col" : "flex-wrap",
                      )}
                    >
                      {entry.variants.map((variant) => (
                        <div
                          key={variant.label}
                          className={cn(
                            "flex flex-col gap-1.5",
                            preview === "wide" && "w-full",
                          )}
                        >
                          <span className="text-[11px] text-fg-muted">
                            {variant.label}
                          </span>
                          <Stage mode={preview}>{variant.render}</Stage>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </section>
            ))}
          </div>

          {/* Docs-site TOC: fumadocs' AnchorProvider tracks which section is in
            view, so the active entry highlights as you scroll. The preview
            control rides along, staying reachable however far you scroll. */}
          <aside className="sticky top-10 hidden h-fit w-44 shrink-0 flex-col gap-5 lg:flex">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-wider text-fg-muted uppercase">
                Preview
              </span>
              <SegmentedControl
                aria-label="Preview framing"
                selectedKeys={[preview]}
                onSelectionChange={(keys) => {
                  const next = keys.values().next().value
                  if (next) setPreview(next as PreviewMode)
                }}
                className="w-full bg-muted"
              >
                {PREVIEW_MODES.map((mode) => (
                  <SegmentedControlItem
                    key={mode.value}
                    id={mode.value}
                    className="flex-1 justify-center text-xs"
                  >
                    {mode.label}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-wider text-fg-muted uppercase">
                On this page
              </span>
              <TOCItems className="gap-0.5 [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:text-xs [&_a:hover]:bg-muted [&_a:hover]:text-fg" />
            </div>
          </aside>
        </div>
      </div>
    </TOCProvider>
  )
}

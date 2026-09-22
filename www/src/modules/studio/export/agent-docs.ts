/* The agent docs a design system exports with: what a coding agent reads to
   build product UI the way this system would. Generated from studio state —
   the Guidance axes plus the look the other chapters resolved — so the docs
   always match the exported code. Pure and React-free: the /r/* routes ship
   it, the panel previews it.

   The layout follows the Sept 2026 research: a portable DESIGN.md (Google
   Stitch format), a task skill with on-demand references, and short
   always-on pointers for Claude Code and Cursor — a small index the agent
   always sees beats one large document it may skip. */

import { registryIcons } from "@/registry/icons/icon-map"
import type { IconLibraryName } from "@/registry/icons/icon-map"
import {
  DEFAULT_COLOR_CONFIG,
  resolveColorConfig,
  semanticLiterals,
  semanticsFor,
} from "@/registry/theme"

import { AGENT_CATALOG } from "../__generated__/agent-catalog"
import type { CatalogEntry } from "../__generated__/agent-catalog"
import type { StudioState } from "../axes"
import { GUIDANCE_AXES, guidanceOption } from "../axes/guidance"
import type { GuidanceAxis, GuidanceKey } from "../axes/guidance"
import { motionTiming } from "../axes/motion"
import { SHAPE_RUNGS } from "../axes/shape"
import { densityTier } from "../axes/space"
import { resolveDesignSystem } from "../resolve"

export interface AgentDoc {
  /** Where the file lands, relative to the consumer's project root. */
  path: string
  content: string
}

export interface AgentDocsInput {
  state: StudioState
  /** The design system's name; generic when absent. */
  name?: string
}

export const SKILL_DIR = ".agents/skills/design-system"

/* -------------------------------- Helpers -------------------------------- */

const MINOR_WORDS = new Set(
  "a an and as at but by for in nor of on or the to via with".split(" "),
)

/** A UI label in the system's casing: `Create project` or `Create Project`. */
function caser(state: StudioState) {
  if (state.guideCasing !== "title") return (text: string) => text
  return (text: string) =>
    text
      .split(" ")
      .map((word, i) =>
        i > 0 && MINOR_WORDS.has(word)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ")
}

const rules = (state: StudioState, group: GuidanceAxis["group"]) =>
  (Object.keys(GUIDANCE_AXES) as GuidanceKey[])
    .filter((key) => GUIDANCE_AXES[key].group === group)
    .flatMap((key) => guidanceOption(key, state).rules)

const bullets = (lines: string[]) => lines.map((line) => `- ${line}`).join("\n")

const px = (value: number) => `${Math.round(value * 100) / 100}px`

const MD_RUNG = {
  id: "md",
  label: "md",
  ratio: 0.75,
  token: "var(--radius-md)",
}

/** The rung a shape role resolves to; `auto` items sit one below surfaces. */
function roleRung(
  state: StudioState,
  role: "control" | "item" | "surface" | "panel",
) {
  const value = {
    control: state.roleControl,
    item: state.roleItem,
    surface: state.roleSurface,
    panel: state.rolePanel,
  }[role]
  const surface = SHAPE_RUNGS.findIndex((r) => r.id === state.roleSurface)
  const rung =
    value === "auto"
      ? SHAPE_RUNGS[Math.max(1, surface - 1)]
      : SHAPE_RUNGS.find((r) => r.id === value)
  return rung ?? MD_RUNG
}

const roundedClass = (rung: (typeof SHAPE_RUNGS)[number]) =>
  rung.id === "none" ? "rounded-none" : `rounded-${rung.id}`

const rungPx = (state: StudioState, rung: (typeof SHAPE_RUNGS)[number]) =>
  rung.ratio === Infinity ? "9999px" : px(state.radiusPx * rung.ratio)

/** How an icon is imported and rendered in the consumer's library. */
function iconUsage(library: IconLibraryName, name: string) {
  const mapped = registryIcons[name]?.[library] ?? name
  switch (library) {
    case "hugeicons":
      return {
        imports: `import { HugeiconsIcon } from "@hugeicons/react"\nimport { ${mapped} } from "@hugeicons/core-free-icons"`,
        jsx: (attrs = "") => `<HugeiconsIcon icon={${mapped}}${attrs} />`,
      }
    case "phosphor":
    case "remix":
    case "tabler": {
      const pkg = {
        phosphor: "@phosphor-icons/react",
        remix: "@remixicon/react",
        tabler: "@tabler/icons-react",
      }[library]
      return {
        imports: `import { ${mapped} } from "${pkg}"`,
        jsx: (attrs = "") => `<${mapped}${attrs} />`,
      }
    }
    default:
      return {
        imports: `import { ${mapped} } from "lucide-react"`,
        jsx: (attrs = "") => `<${mapped}${attrs} />`,
      }
  }
}

const ICON_PACKAGES: Record<IconLibraryName, string> = {
  lucide: "lucide-react",
  phosphor: "@phosphor-icons/react",
  tabler: "@tabler/icons-react",
  remix: "@remixicon/react",
  hugeicons: "@hugeicons/react + @hugeicons/core-free-icons",
}

const LIBRARY_LABELS: Record<IconLibraryName, string> = {
  lucide: "Lucide",
  phosphor: "Phosphor",
  tabler: "Tabler",
  remix: "Remix",
  hugeicons: "Hugeicons",
}

/* ------------------------------ The look ------------------------------ */

interface Look {
  name: string
  literals: Record<"light" | "dark", Record<string, string>>
  fonts: { body: string; heading: string; mono: string }
  tier: ReturnType<typeof densityTier>
  unitPx: number
  icons: IconLibraryName
  primaryIsAccent: boolean
}

function look(input: AgentDocsInput): Look {
  const { state } = input
  const ds = resolveDesignSystem(state)
  const engine = resolveColorConfig(ds.color ?? DEFAULT_COLOR_CONFIG)
  return {
    name: input.name?.trim() || "Design system",
    literals: semanticLiterals(semanticsFor(ds.color), engine),
    fonts: {
      body: state.bodyFont,
      heading: state.headingFont || state.bodyFont,
      mono: state.monoFont,
    },
    tier: densityTier(state.density),
    unitPx: state.spacingUnit,
    icons: ds.icons ?? "lucide",
    primaryIsAccent: ds.color?.primary === "accent",
  }
}

/** Surfaces, in words an agent can act on. */
function elevationRules(state: StudioState): string[] {
  const out: string[] = []
  switch (state.surfaceStrategy) {
    case "shadow":
      out.push(
        "Cards and overlays separate from the page with shadows; borders stay subtle. Use `Card` rather than drawing your own shadows.",
      )
      break
    case "tonal":
      out.push(
        "Surfaces separate by tone, not lines or shadows: containers sit on a slightly different fill than the page. Don't add borders or shadows to fake separation.",
      )
      break
    case "adaptive":
      out.push(
        "In light mode surfaces lift on soft shadows; in dark mode they switch to hairlines and a lighter fill. `Card`, `Popover` and `Modal` already do this — don't hand-roll either.",
      )
      break
    default:
      out.push(
        "Separate with 1px hairlines (`border-border`), not shadows. Cards are bordered and flat; only floating layers (menus, popovers, dialogs) cast a shadow.",
      )
  }
  if (state.surfaceCanvas === "tinted")
    out.push(
      "The page background is tinted; cards and panels are the lighter surface on top of it.",
    )
  if (state.surfaceMaterial === "glass")
    out.push(
      "Menus and popovers are translucent glass — that's the component's job; never apply blur or transparency to other surfaces.",
    )
  out.push(
    "Never nest a card inside a card. Group content inside one card with `Separator` or spacing instead.",
  )
  return out
}

function motionRules(state: StudioState): string[] {
  const timing = motionTiming(state)
  const out = [
    `Overlays already animate in (${timing.enterMs}ms) and out (${timing.exitMs}ms). For a custom entrance use \`duration-enter ease-enter\`; don't invent curves or durations.`,
  ]
  if (state.motionCharacter === "spring")
    out.push("Motion is springy on entrances only; exits are quick and plain.")
  if (state.motionState === "instant")
    out.push(
      "Hover and press states change instantly: no `transition-*` on state colors.",
    )
  out.push(
    "Animate `opacity` and `transform` only, and respect `prefers-reduced-motion` (`motion-safe:`).",
  )
  return out
}

/* ------------------------------- DESIGN.md ------------------------------- */

const COLOR_KEYS: Array<[string, string]> = [
  ["primary", "color-primary"],
  ["on-primary", "color-fg-on-primary"],
  ["background", "color-bg"],
  ["foreground", "color-fg"],
  ["foreground-muted", "color-fg-muted"],
  ["surface", "color-card"],
  ["popover", "color-popover"],
  ["muted", "color-muted"],
  ["border", "color-border"],
  ["border-control", "color-border-control"],
  ["focus", "color-border-focus"],
  ["accent", "color-accent"],
  ["success", "color-success"],
  ["warning", "color-warning"],
  ["danger", "color-danger"],
  ["info", "color-info"],
]

const TOKEN_ROLES: Array<[string, string]> = [
  ["`bg-bg` · `text-fg`", "Page background and body text."],
  ["`text-fg-muted`", "Secondary text: descriptions, metadata, placeholders."],
  ["`bg-muted`", "Subtle fills: wells, code, inline highlights."],
  [
    "`bg-card` · `bg-popover`",
    "Surfaces — reach for `Card` / `Popover`, not the classes.",
  ],
  ["`border-border`", "Structural edges: dividers, cards, sections."],
  ["`border-border-control`", "Edges of custom controls only."],
  [
    "`bg-primary` · `text-fg-on-primary`",
    'The primary action. `Button variant="primary"` already applies it.',
  ],
  ["`bg-accent` · `bg-accent-muted` · `text-fg-accent`", "Brand highlight."],
  [
    "`bg-{status}-muted` · `text-fg-{status}`",
    "Soft status callouts (`success`, `warning`, `danger`, `info`).",
  ],
  [
    "`bg-{status}` · `text-fg-on-{status}`",
    "Solid status fills — badges, destructive buttons.",
  ],
]

function designMd(input: AgentDocsInput, l: Look): string {
  const { state } = input
  const t = caser(state)
  const control = l.tier.control * l.unitPx
  const panel = roleRung(state, "panel")
  const surface = roleRung(state, "surface")
  const controlRung = roleRung(state, "control")
  const item = roleRung(state, "item")
  const character = [
    l.primaryIsAccent
      ? "brand-colored primary actions"
      : "neutral primary actions",
    `${state.surfaceStrategy} surfaces`,
    `${l.tier.label.toLowerCase()} density`,
    `${px(state.radiusPx)} base radius`,
    `${l.fonts.body} type`,
  ].join(", ")

  const frontMatter = [
    "---",
    "version: alpha",
    `name: ${JSON.stringify(l.name)}`,
    `description: ${JSON.stringify(`${l.name} — a dotUI design system: ${character}.`)}`,
    "colors:",
    ...COLOR_KEYS.map(
      ([key, token]) =>
        `  ${key}: ${JSON.stringify(l.literals.light[token] ?? "")}`,
    ),
    "typography:",
    "  body:",
    `    fontFamily: ${JSON.stringify(l.fonts.body)}`,
    `    fontSize: ${l.tier.textPx}px`,
    "  heading:",
    `    fontFamily: ${JSON.stringify(l.fonts.heading)}`,
    "    fontWeight: 600",
    "  mono:",
    `    fontFamily: ${JSON.stringify(l.fonts.mono)}`,
    "rounded:",
    `  control: ${rungPx(state, controlRung)}`,
    `  item: ${rungPx(state, item)}`,
    `  surface: ${rungPx(state, surface)}`,
    `  panel: ${rungPx(state, panel)}`,
    "spacing:",
    `  unit: ${px(l.unitPx)}`,
    `  control-height: ${px(control)}`,
    "---",
  ].join("\n")

  return `${frontMatter}

# ${l.name}

## Overview

${l.name} is built on **dotUI**: React Aria Components styled with Tailwind CSS v4 and tailwind-variants. Its character: ${character}.

- The components live in \`components/ui/\` and you own their source. **Compose them — never rebuild a button, field, menu or dialog from \`div\`s.** Missing one? \`npx shadcn@latest add @dotui/<name>\`.
- Read a component's file before using it: its props, variants and parts are there.
- This is not shadcn/ui on Radix or Base UI. There is no \`asChild\`; events are React Aria's (\`onPress\`, \`onChange\`, \`onAction\`, \`onSelectionChange\`); state is \`isDisabled\` / \`isInvalid\` / \`isSelected\`, styled through data attributes. If a shadcn skill or rule is active, follow its general advice but take every component API from \`components/ui/\`.
- Deeper guidance — choosing between components, page patterns with code — is in the \`design-system\` skill (\`${SKILL_DIR}/SKILL.md\`).

## Colors

Colors are semantic tokens defined in the global stylesheet, light and dark. Use the utilities; never hardcode a color or reach for a Tailwind palette class (\`bg-blue-500\`, \`text-gray-600\`).

| Utility | Use for |
| --- | --- |
${TOKEN_ROLES.map(([u, use]) => `| ${u} | ${use} |`).join("\n")}

${bullets(rules(state, "Hierarchy").filter((r) => /color|tint/i.test(r)))}

## Typography

- Body: ${l.fonts.body} (\`font-sans\`), ${l.tier.textPx}px (\`${l.tier.textPx < 14 ? "text-xs" : "text-sm"}\`) in product UI. Headings: ${l.fonts.heading === l.fonts.body ? "the body family" : l.fonts.heading} — \`h1\`–\`h6\` pick up the heading font and weight automatically. Code and numbers that must align: ${l.fonts.mono} (\`font-mono\`, \`tabular-nums\`).
- Page title \`text-2xl\`, section title \`text-lg\`, card title via \`CardTitle\`. At most three sizes on one screen.
- Muted text is \`text-fg-muted\`, never a lighter gray or reduced opacity.

## Layout

- Density is ${l.tier.label.toLowerCase()}: controls are ${px(control)} tall and components already carry the system's padding. Don't override component heights or paddings.
- The spacing unit is ${px(l.unitPx)}. Lay out with \`flex\`/\`grid\` and \`gap-*\`; stack form fields with \`FieldGroup\`, not margins.
- App shells use \`Sidebar\` for primary navigation; content sits in a readable column (\`max-w-3xl\` for forms and settings, full width for tables).
- Every layout works from 320px up. Use logical properties (\`ms-*\`, \`pe-*\`, \`start-*\`) so right-to-left works.

## Elevation & Depth

${bullets(elevationRules(state))}

## Shapes

Radii come in four roles. Custom elements take the role of what they resemble:

| Role | Examples | Class |
| --- | --- | --- |
| Panel | card, dialog, sheet | \`${roundedClass(panel)}\` |
| Surface | popover, menu, toast | \`${roundedClass(surface)}\` |
| Control | button, input, select | \`${roundedClass(controlRung)}\` |
| Item | menu item, list row | \`${roundedClass(item)}\` |

## Components

${bullets([
  `Icons: ${LIBRARY_LABELS[l.icons]} (\`${ICON_PACKAGES[l.icons]}\`) only — never mix icon sets, never use emoji or unicode glyphs as icons.`,
  "Forms: `TextField`/`Select`/`Combobox`/`RadioGroup` with `Label`, `Description`, `FieldError` from `field`; stack with `FieldGroup`, group with `Fieldset` + `Legend`.",
  "Overlays: `Dialog` + `Modal` for decisions, `Drawer` on mobile sheets, `Popover` for light non-blocking content, `Tooltip` for labels only.",
  "Feedback: `toastManager.add()` for results of an action, `Alert` for persistent page-level messages, `Empty` for empty states, `Skeleton` while loading.",
  "The full catalog and decision trees: `" +
    SKILL_DIR +
    "/references/components.md`.",
])}

## Motion

${bullets(motionRules(state))}

## Voice & copy

${bullets([
  ...rules(state, "Copy"),
  `Buttons say what they do, verb first: “${t("Save changes")}”, “${t("Delete project")}” — never “Submit”, “OK” or “Yes”. The same action keeps the same name through the flow.`,
  "Errors say what went wrong and how to fix it, next to the field: “Enter an email address like name@example.com”. No blame, no apology, no “Oops”.",
  "Empty states say what will appear here and offer the action that creates it.",
  "Use numerals (“3 files”), and “…” for actions that open a follow-up step.",
])}

## Hierarchy & patterns

${bullets([
  ...rules(state, "Hierarchy").filter((r) => !/color|tint/i.test(r)),
  ...rules(state, "Patterns"),
  'Destructive actions use `variant="danger"` and a confirming `Dialog` that names what will be lost.',
])}

## Accessibility

- Every control has a visible \`Label\` or an \`aria-label\`; every icon-only button has an \`aria-label\` and a \`Tooltip\`.
- Never signal state with color alone — pair it with text or an icon.
- Keep the focus ring: don't remove outlines. Custom interactive elements use \`focus-visible:focus-ring\`.
- Use semantic headings in order, one \`h1\` per page. Dialogs always have a \`DialogTitle\`.

## Do's and Don'ts

| Do | Don't |
| --- | --- |
| Import from \`components/ui/*\` | Rebuild controls from \`div\` and \`onClick\` |
| Semantic tokens (\`bg-muted\`, \`text-fg-muted\`) | Hex, \`rgb()\`, or palette classes (\`bg-zinc-100\`) |
| \`gap-*\` inside flex/grid | Margins between siblings, \`space-y-*\` |
| One \`Card\` with sections | Cards inside cards |
| Flat surfaces with meaning | Gradients, gradient text, glows, decorative blur |
| Plain, specific labels | Arrows appended to CTAs (“Get started →”), “A · B · C” meta strings |
| The system's radii and shadows | Arbitrary values (\`rounded-[14px]\`, \`shadow-[…]\`) |
`
}

/* --------------------------------- Skill --------------------------------- */

function skillMd(l: Look): string {
  return `---
name: design-system
description: Build UI with ${l.name}, this project's design system (dotUI on React Aria Components). Use when creating or changing any page, form, dialog, table, navigation or other interface in this app.
---

# Building with ${l.name}

## Workflow

1. Read \`DESIGN.md\` at the project root — the tokens, the voice and the rules. It is the source of truth; this skill applies it.
2. Pick components with \`references/components.md\`. Check \`components/ui/\` for what is installed; add a missing one with \`npx shadcn@latest add @dotui/<name>\`.
3. Read the component file before using it — props, variants and parts are defined there.
4. Start from the closest pattern in \`references/patterns.md\` and adapt it.
5. Review against the checklist below before you finish.

## Rules that are easy to get wrong

- React Aria, not Radix: \`onPress\` (not \`onClick\`) on \`Button\`; \`isDisabled\`, \`isInvalid\`, \`isRequired\`; \`selectedKey\` / \`onSelectionChange\` on \`Select\`; no \`asChild\` — links that look like buttons are \`LinkButton\`.
- Overlays are composed: a trigger and its overlay (\`Modal\`, \`Drawer\`, \`Popover\`) are siblings inside \`Dialog\`, \`Menu\` or \`Tooltip\`.
- Buttons that close a dialog take \`slot="close"\`.
- Icons inside buttons need no sizing classes; mark position with \`data-icon-start\` / \`data-icon-end\`.
- Style with semantic tokens only; use \`className\` for layout (width, grid placement), not to restyle a component.

## Review checklist

- [ ] Every interactive element is a \`components/ui\` component.
- [ ] No hardcoded colors, radii, shadows or font sizes.
- [ ] One primary action per view (or as \`DESIGN.md\` allows).
- [ ] Labels, casing and tone follow **Voice & copy** in \`DESIGN.md\`.
- [ ] Empty, loading and error states exist for every collection and async action.
- [ ] Icon-only buttons have \`aria-label\` + \`Tooltip\`; the page works at 320px.
`
}

const GROUP_LABELS: Record<string, string> = {
  buttons: "Buttons",
  inputs: "Text inputs",
  "selection-controls": "Selection controls",
  pickers: "Pickers",
  sliders: "Sliders",
  "menus-lists": "Menus & lists",
  overlays: "Overlays",
  navigation: "Navigation",
  disclosure: "Disclosure",
  containers: "Layout & containers",
  feedback: "Feedback",
  progress: "Progress",
  tags: "Tags",
  typography: "Typography",
  calendar: "Dates",
  "color-swatches": "Color",
  charts: "Charts",
  "drop-zone": "Files",
}

function componentsMd(input: AgentDocsInput): string {
  const { state } = input
  const groups = new Map<string, CatalogEntry[]>()
  for (const entry of AGENT_CATALOG) {
    const list = groups.get(entry.group) ?? []
    list.push(entry)
    groups.set(entry.group, list)
  }
  const catalog = [...groups.entries()]
    .sort(
      ([a], [b]) =>
        Object.keys(GROUP_LABELS).indexOf(a) -
        Object.keys(GROUP_LABELS).indexOf(b),
    )
    .map(
      ([group, entries]) =>
        `### ${GROUP_LABELS[group] ?? group}\n\n${entries
          .map(
            (e) =>
              `- **${e.title}** (\`@dotui/${e.name}\`) — ${e.description}${
                e.exports.length
                  ? ` Exports: ${e.exports.map((x) => `\`${x}\``).join(", ")}.`
                  : ""
              }`,
          )
          .join("\n")}`,
    )
    .join("\n\n")

  const choices = guidanceOption("guideChoices", state)
  const data = guidanceOption("guideData", state)

  return `# Components

Import from \`@/components/ui/<name>\`. Install a missing one with \`npx shadcn@latest add @dotui/<name>\`.

## Choosing between components

**Picking one option**
${bullets(choices.rules)}
- Switching between views of the same content → \`Tabs\` (page sections) or \`SegmentedControl\` (compact, in a toolbar).

**Picking several options**
- Few → \`CheckboxGroup\`; many or searchable → \`Combobox\` with multiple selection; free-form entries → \`TokenField\`.

**On/off**
- Applies immediately → \`Switch\`. Submitted with a form → \`Checkbox\`. A pressed state in a toolbar → \`ToggleButton\`.

**Actions**
- Does something → \`Button\`. Goes somewhere → \`Link\` (inline) or \`LinkButton\` (looks like a button).
- Several related actions → a \`Menu\` behind one \`Button\`; a row of equal actions → \`ToggleButtonGroup\` or a \`Group\` of buttons.

**Showing something on top**
- A decision or a form → \`Dialog\` + \`Modal\` (\`Drawer\` on small screens).
- Light, non-blocking detail anchored to a trigger → \`Dialog\` + \`Popover\`.
- A label for an icon-only control → \`Tooltip\`. Never put interactive content in a tooltip.
- Command palette → \`Command\`.

**Telling the user something**
- The result of their action → \`toastManager.add()\` (mount \`ToastProvider\` once at the root).
- A standing condition on the page → \`Alert\`.
- Nothing to show yet → \`Empty\`. Still loading → \`Skeleton\` shaped like the content, \`Loader\` inside buttons.
- Short status on an item → \`Badge\`.

**Collections**
${bullets(data.rules)}
- Hierarchical data → \`Tree\`. Plain selectable list → \`ListBox\`.

## Catalog

${catalog}
`
}

function patternsMd(input: AgentDocsInput, l: Look): string {
  const { state } = input
  const t = caser(state)
  const plus = iconUsage(l.icons, "PlusIcon")
  const more = iconUsage(l.icons, "MoreHorizontalIcon")
  const describe = state.guideCopy !== "terse"
  const warm = state.guideVoice !== "plain"

  const form =
    state.guideForms === "single"
      ? `\`\`\`tsx
import { Button } from "@/components/ui/button"
import { ${describe ? "Description, " : ""}Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"

// One question per screen; the step's only primary action continues.
<form className="flex max-w-md flex-col gap-6" onSubmit={next}>
  <h1 className="text-2xl">${t("What's your work email?")}</h1>
  <TextField type="email" autoComplete="email" isRequired>
    <Label>${t("Work email")}</Label>
    <Input />${describe ? `\n    <Description>We'll send a confirmation link.</Description>` : ""}
  </TextField>
  <Button type="submit" variant="primary">${t("Continue")}</Button>
</form>
\`\`\``
      : `\`\`\`tsx
import { Button } from "@/components/ui/button"
import { ${describe ? "Description, " : ""}FieldGroup, Fieldset, Label, Legend } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { TextField } from "@/components/ui/text-field"

<form className="flex max-w-3xl flex-col gap-8">
  <Fieldset>
    <Legend>${t("Profile")}</Legend>
    <FieldGroup>
      <TextField isRequired>
        <Label>${t("Display name")}</Label>
        <Input />
      </TextField>
      <TextField type="email" isRequired>
        <Label>${t("Email")}</Label>
        <Input />${describe ? `\n        <Description>Used for sign-in and notifications.</Description>` : ""}
      </TextField>
      <Select defaultSelectedKey="utc">
        <Label>${t("Time zone")}</Label>
        <SelectTrigger />
        <SelectContent>
          <SelectItem id="utc">UTC</SelectItem>
          <SelectItem id="cet">Central European Time</SelectItem>
        </SelectContent>
      </Select>
    </FieldGroup>
  </Fieldset>
  <Button type="submit" variant="primary" className="self-start">
    ${t("Save changes")}
  </Button>
</form>
\`\`\`${state.guideForms === "stepped" ? "\n\nFor more than ~7 fields, split the fieldsets into steps: show progress (“Step 2 of 3”), keep each step's only primary action “" + t("Continue") + "”, and let the user go back without losing input." : ""}`

  const collection =
    state.guideData === "cards"
      ? `\`\`\`tsx
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {projects.map((project) => (
    <li key={project.id}>
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>Updated {project.updatedAt}</CardDescription>
        </CardHeader>
      </Card>
    </li>
  ))}
</ul>
\`\`\``
      : `\`\`\`tsx
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableColumn, TableContainer, TableHeader, TableRow,
} from "@/components/ui/table"

<TableContainer>
  <Table aria-label="${t("Projects")}">
    <TableHeader>
      <TableColumn isRowHeader>${t("Name")}</TableColumn>
      <TableColumn>${t("Status")}</TableColumn>
      <TableColumn>${t("Updated")}</TableColumn>
    </TableHeader>
    <TableBody items={projects} renderEmptyState={() => <ProjectsEmpty />}>
      {(project) => (
        <TableRow>
          <TableCell>{project.name}</TableCell>
          <TableCell>
            <Badge variant={project.live ? "success" : "neutral"}>
              {project.live ? "${t("Live")}" : "${t("Draft")}"}
            </Badge>
          </TableCell>
          <TableCell className="tabular-nums text-fg-muted">{project.updatedAt}</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
\`\`\``

  return `# Patterns

Starting points written in this system's voice. Adapt them; keep the structure.

## Page header

\`\`\`tsx
import { Button } from "@/components/ui/button"
${plus.imports}

<header className="flex flex-wrap items-end justify-between gap-4">
  <div className="flex flex-col gap-1">${state.guideEyebrows === "allowed" ? `\n    <p className="text-sm text-fg-muted">${t("Workspace")}</p>` : ""}
    <h1 className="text-2xl">${t("Projects")}</h1>${describe ? `\n    <p className="text-sm text-fg-muted">Everything your team is building, in one place.</p>` : ""}
  </div>
  <Button variant="primary">
    ${plus.jsx(' data-icon-start=""')} ${t("New project")}
  </Button>
</header>
\`\`\`

## Form

${form}

## Collection

${collection}

## Empty state

\`\`\`tsx
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

<Empty>
  <EmptyHeader>
    <EmptyTitle>${t("No projects yet")}</EmptyTitle>
    <EmptyDescription>${warm ? "Projects you create will show up here. Start with your first one." : "Projects you create appear here."}</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="primary">${t("Create project")}</Button>
  </EmptyContent>
</Empty>
\`\`\`

## Row actions

\`\`\`tsx
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
${more.imports}

<Menu>
  <Tooltip>
    <Button variant="quiet" size="sm" isIconOnly aria-label="${t("Project actions")}">
      ${more.jsx()}
    </Button>
    <TooltipContent>${t("Actions")}</TooltipContent>
  </Tooltip>
  <Popover>
    <MenuContent onAction={handleAction}>
      <MenuItem id="rename">${t("Rename")}</MenuItem>
      <MenuItem id="duplicate">${t("Duplicate")}</MenuItem>
      <MenuItem id="delete">${t("Delete")}…</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
\`\`\`

## Destructive confirmation

\`\`\`tsx
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"

<Dialog>
  <Button variant="danger">${t("Delete project")}…</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>${t("Delete “Acme web”?")}</DialogTitle>
        <DialogDescription>
          This permanently deletes the project and its 12 deployments. You can't undo this.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button slot="close">${t("Cancel")}</Button>
        <Button slot="close" variant="danger" onPress={deleteProject}>
          ${t("Delete project")}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
\`\`\`

## Action feedback

\`\`\`tsx
import { toastManager } from "@/components/ui/toast"

toastManager.add({ title: "Changes saved", type: "success" })
toastManager.add({
  title: "Couldn't save changes",
  description: "Check your connection and try again.",
  type: "error",
})
\`\`\`
`
}

/* ---------------------------- Always-on pointer ---------------------------- */

function pointer(l: Look): string {
  return `# ${l.name}

This app's UI is built with ${l.name}, a dotUI design system (React Aria Components + Tailwind CSS v4).

Before writing or changing UI:
- Read \`DESIGN.md\` (tokens, voice, rules) and follow the \`design-system\` skill at \`${SKILL_DIR}/SKILL.md\`.
- Compose components from \`components/ui/\`; never rebuild them. Add missing ones with \`npx shadcn@latest add @dotui/<name>\`.
- React Aria APIs, not Radix: \`onPress\`, \`isDisabled\`, no \`asChild\`.
- Semantic color tokens only (\`bg-primary\`, \`text-fg-muted\`, \`border-border\`) — no hex values or palette classes.
`
}

/* --------------------------------- Entry --------------------------------- */

export function buildAgentDocs(input: AgentDocsInput): AgentDoc[] {
  const l = look(input)
  return [
    { path: "DESIGN.md", content: designMd(input, l) },
    { path: `${SKILL_DIR}/SKILL.md`, content: skillMd(l) },
    {
      path: `${SKILL_DIR}/references/components.md`,
      content: componentsMd(input),
    },
    {
      path: `${SKILL_DIR}/references/patterns.md`,
      content: patternsMd(input, l),
    },
    {
      path: ".claude/rules/design-system.md",
      content: `---\npaths:\n  - "**/*.{tsx,jsx}"\n---\n\n${pointer(l)}`,
    },
    {
      path: ".cursor/rules/design-system.mdc",
      content: `---\ndescription: How to build UI in this app with its design system\nglobs: "**/*.tsx,**/*.jsx"\nalwaysApply: false\n---\n\n${pointer(l)}`,
    },
  ]
}

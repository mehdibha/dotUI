"use client"

/* Button — the pages its own page opens. Variants lists every variant with
   a specimen and the rows that tune it; specimens draw in the engine's own
   colors. */

import { Fragment } from "react"

import type { ModeOutput } from "@dotui/colors"

import type { PrimaryColorSource } from "@/registry/theme"

import type { Effective } from "../axes"
import { SECONDARY_OPTIONS } from "../axes/buttons.meta"
import { LOOKS } from "../axes/style"
import type { ChapterPage } from "../chapters"
import { DIAL_LABEL, DialGap, DialSelect } from "../dial"
import { usePanelMode } from "../panel-mode"
import { Row } from "../row-host"
import type { RowMap } from "../row-host"
import type { AxisKey } from "../use-axis"
import { inks } from "./primary"

const VARIANTS: {
  id: string
  label: string
  text: string
  rows: [AxisKey, string][]
}[] = [
  {
    id: "primary",
    label: "Primary",
    text: "Save",
    rows: [["buttonColor", "Color"]],
  },
  {
    id: "secondary",
    label: "Secondary",
    text: "Cancel",
    rows: [["buttonSecondary", "Fill"]],
  },
  { id: "quiet", label: "Quiet", text: "Edit", rows: [] },
  {
    id: "link",
    label: "Link",
    text: "Docs",
    rows: [
      ["linkColor", "Color"],
      ["linkUnderline", "Underline"],
    ],
  },
  { id: "warning", label: "Warning", text: "Archive", rows: [] },
  { id: "danger", label: "Danger", text: "Delete", rows: [] },
]

/** Link's rows live on the Link page. */
const HOSTED: AxisKey[] = ["linkColor", "linkUnderline"]

const step = (m: ModeOutput, palette: string, name: string) =>
  m.scales[palette]?.[name as keyof (typeof m.scales)[string]] ?? m.background

/** A variant's face at rest: fill, edge, ink. */
function face(id: string, state: Effective, m: ModeOutput) {
  const ink = inks(m)
  const solid = (palette: string) => ({
    background: step(m, palette, "700"),
    color: m.on[palette]?.["700"] ?? m.background,
  })
  const edge = `inset 0 0 0 1px ${step(m, "neutral", "400")}`
  const text = step(m, "neutral", "950")
  switch (id) {
    case "primary": {
      const { fill, on } =
        ink[state.buttonColor as PrimaryColorSource] ?? ink.accent
      return { background: fill, color: on }
    }
    case "secondary": {
      const look =
        state.buttonSecondary === "as-style"
          ? LOOKS[state.style].button
          : state.buttonSecondary
      if (look === "soft")
        return { background: step(m, "neutral", "100"), color: text }
      if (look === "tonal")
        return { background: ink.accent.wash, color: ink.accent.text }
      if (look === "solid")
        return {
          background: step(m, "neutral", "800"),
          color: step(m, "neutral", "25"),
        }
      if (look === "outline") return { boxShadow: edge, color: text }
      if (look === "flat")
        return {
          background: step(m, "neutral", "100"),
          boxShadow: edge,
          color: text,
        }
      // A plate on an edge: raised and the closed looks' own.
      return {
        background: m.background,
        boxShadow: `${edge}, 0 1px 2px rgb(0 0 0 / 0.08)`,
        color: text,
      }
    }
    case "link":
      return {
        color: state.linkColor === "neutral" ? text : ink.accent.text,
        textDecoration:
          state.linkUnderline === "always" ? "underline" : undefined,
        paddingInline: 0,
      }
    case "warning":
    case "danger":
      return solid(id)
    default:
      return { color: text }
  }
}

function Specimen({
  id,
  text,
  state,
}: {
  id: string
  text: string
  state: Effective
}) {
  const { m } = usePanelMode(state)
  return (
    <span
      className="flex h-6 shrink-0 items-center rounded-md px-2.5 text-[11px] font-semibold underline-offset-2"
      style={face(id, state, m)}
    >
      {text}
    </span>
  )
}

/** The Button page's value for Variants: each variant's face, small. */
export function VariantsPreview({ state }: { state: Effective }) {
  const { m } = usePanelMode(state)
  return (
    <span className="flex items-center gap-1">
      {VARIANTS.filter(({ id }) => id !== "link" && id !== "quiet").map(
        ({ id }) => (
          <span
            key={id}
            className="h-3 w-4 rounded-[3px]"
            style={face(id, state, m)}
          />
        ),
      )}
    </span>
  )
}

export const VARIANTS_PAGE: ChapterPage = {
  id: "button-variants",
  label: "Variants",
  parent: "button",
  owners: VARIANTS.flatMap(({ rows }) =>
    rows.flatMap(([key]) => (HOSTED.includes(key) ? [] : [key])),
  ),
  aliases: ["Button variants", ...VARIANTS.map(({ label }) => label)],
  rows: VARIANTS.flatMap(({ label, rows }) =>
    rows.map(([key, name]) => ({ name: `${label} › ${name}`, key })),
  ),
  Body: function VariantsPage({ studio }) {
    return VARIANTS.map(({ id, label, text, rows }, i) => (
      <Fragment key={id}>
        {i > 0 && <DialGap />}
        <div
          data-variant={id}
          className="flex h-9 items-center justify-between gap-3 px-3"
        >
          <span className={DIAL_LABEL}>{label}</span>
          <Specimen id={id} text={text} state={studio.effective} />
        </div>
        {rows.map(([key, name]) => (
          <Row key={key} axis={key} label={name} />
        ))}
      </Fragment>
    ))
  },
}

function ButtonSecondaryRow() {
  return (
    <DialSelect
      axis="buttonSecondary"
      label="Fill"
      options={SECONDARY_OPTIONS}
    />
  )
}

export const ROWS: RowMap = {
  buttonSecondary: ButtonSecondaryRow,
}

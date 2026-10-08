"use client"

/* Data display: table, accordion, avatar, kbd, card. */

import { cn } from "@/registry/lib/utils"

import { CONTAINER_OPTIONS, MARKER_OPTIONS } from "../axes/accordion.meta"
import { FALLBACK_OPTIONS, SHAPE_OPTIONS } from "../axes/avatars.meta"
import { CARD_HEADER_OPTIONS, FOOTER_OPTIONS } from "../axes/card.meta"
import { TREATMENT_OPTIONS } from "../axes/kbd.meta"
import { HEADER_LABEL_OPTIONS, HEADER_OPTIONS } from "../axes/tables.meta"
import { DialGap, DialGlyph, DialSegmented, DialSelect } from "../dial"
import { MemberSection, Row } from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective, Studio } from "../state"
import { useStudio } from "../use-studio"

/* -------------------------------- Specimens -------------------------------- */

const glyph = (node: React.ReactNode) => <DialGlyph>{node}</DialGlyph>

/** 16px on the row; 32px in the popover, where the options differ by a hairline. */
const sized = (draw: (className?: string) => React.ReactNode) => ({
  preview: draw("size-8"),
  glyph: glyph(draw()),
})

/** The grid: a header rule or band over its labels, then ruled rows. */
function TableGlyph({
  header,
  label,
  className,
}: {
  header: string
  label: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {header === "filled" && (
        <path
          d="M3.75 9V6.25a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5V9z"
          fill="currentColor"
          fillOpacity=".2"
        />
      )}
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" opacity=".45" />
      <path
        d="M3.75 12.75h16.5M3.75 16.5h16.5"
        stroke="currentColor"
        opacity=".3"
      />
      <path
        d="M6 6.75h4M13 6.75h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={label === "strong" ? 1 : 0.45}
      />
      <path
        d="M6 11h6M6 14.75h5M6 18.25h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  )
}

/** Three items, the first open: their grouping and their marker. */
function AccordionGlyph({
  layout,
  marker,
  className,
}: {
  layout: string
  marker: string
  className?: string
}) {
  const leading = marker === "leading-caret"
  const rows = layout === "separated" ? [4, 11.5, 16.5] : [5.25, 12.4, 17.25]
  const title = (y: number) => (
    <path
      d={leading ? `M10 ${y}h6` : `M6.5 ${y}h7`}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  )
  const mark = (y: number, open: boolean) =>
    leading ? (
      <path
        d={
          open
            ? `M5.5 ${y - 1}l1.5 1.75 1.5-1.75`
            : `M6 ${y - 1.5}l1.5 1.5L6 ${y + 1.5}`
        }
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".6"
      />
    ) : (
      <path
        d={
          open
            ? `M16.5 ${y + 0.75}l1.5-1.5 1.5 1.5`
            : `M16.5 ${y - 0.75}l1.5 1.5 1.5-1.5`
        }
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".6"
      />
    )
  const boxed = layout === "contained" || layout === "separated"
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {layout === "separated" ? (
        <>
          <rect
            x="3.75"
            y="1.75"
            width="16.5"
            height="7.75"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity=".55"
          />
          {[9.75, 14.75].map((y) => (
            <rect
              key={y}
              x="3.75"
              y={y}
              width="16.5"
              height="3.5"
              rx="1.25"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeOpacity=".55"
            />
          ))}
        </>
      ) : (
        <>
          {layout === "contained" && (
            <>
              <path
                d="M3.75 4a1.25 1.25 0 0 1 1.25-1.25h14A1.25 1.25 0 0 1 20.25 4v6H3.75z"
                fill="currentColor"
                fillOpacity=".12"
              />
              <rect
                x="3.75"
                y="2.75"
                width="16.5"
                height="17"
                rx="1.25"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeOpacity=".55"
              />
            </>
          )}
          {(layout === "divided" || layout === "contained") && (
            <path
              d={
                boxed ? "M3.75 10h16.5M3.75 14.75h16.5" : "M3 10h18M3 14.75h18"
              }
              stroke="currentColor"
              opacity=".4"
            />
          )}
        </>
      )}
      {rows.map((y, i) => (
        <g key={y}>
          {title(y)}
          {mark(y, i === 0)}
        </g>
      ))}
      <path
        d={leading ? "M10 7.5h7" : "M6.5 7.5h9"}
        stroke="currentColor"
        strokeLinecap="round"
        opacity=".4"
      />
    </svg>
  )
}

function AvatarGlyph({ shape, fallback }: { shape: string; fallback: string }) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center text-[7px] font-semibold",
        shape === "circle" ? "rounded-full" : "rounded-[4px]",
        fallback === "accent"
          ? "bg-accent-muted text-fg-accent"
          : "bg-muted text-fg-muted",
      )}
    >
      AB
    </span>
  )
}

function KbdGlyph({ treatment }: { treatment: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {treatment === "chip" && (
        <rect
          x="3"
          y="7"
          width="18"
          height="10"
          rx="2.5"
          fill="currentColor"
          opacity=".15"
        />
      )}
      {treatment === "outline" && (
        <rect
          x="3.5"
          y="7"
          width="17"
          height="10"
          rx="2.5"
          stroke="currentColor"
          strokeOpacity=".5"
        />
      )}
      {treatment === "keycap" && (
        <>
          <rect
            x="3.5"
            y="5.5"
            width="17"
            height="12"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M5.5 19.25h13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      <text
        x="12"
        y={treatment === "keycap" ? 11.75 : 12.25}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={treatment === "keycap" ? 7.5 : 8}
        fontWeight="500"
        fontFamily={
          treatment === "keycap" ? "ui-monospace, monospace" : undefined
        }
        fill="currentColor"
      >
        ⌘K
      </text>
    </svg>
  )
}

/** A card: title, body, then the footer, each part set apart or not. */
function CardGlyph({
  header,
  footer,
  className,
}: {
  header: string
  footer: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {header === "band" && (
        <path
          d="M3.75 9.75V6.25a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v3.5z"
          fill="currentColor"
          fillOpacity=".2"
        />
      )}
      {footer === "band" && (
        <path
          d="M3.75 14.5h16.5v3.75a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5z"
          fill="currentColor"
          fillOpacity=".2"
        />
      )}
      <rect
        x="3"
        y="4"
        width="18"
        height="16.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".55"
      />
      {header !== "none" && (
        <path d="M3.75 9.75h16.5" stroke="currentColor" opacity=".5" />
      )}
      {footer !== "none" && (
        <path d="M3.75 14.5h16.5" stroke="currentColor" opacity=".5" />
      )}
      <path
        d="M6 7.25h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 12h11"
        stroke="currentColor"
        strokeLinecap="round"
        opacity=".45"
      />
      <rect
        x="14"
        y="16.25"
        width="4"
        height="2"
        rx=".75"
        fill="currentColor"
      />
    </svg>
  )
}

/* ---------------------------------- Rows ---------------------------------- */

function TableHeaderRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="tableHeader"
      label="Table header"
      options={HEADER_OPTIONS.map((option) => ({
        ...option,
        ...sized((className) => (
          <TableGlyph
            className={className}
            header={option.value}
            label={effective.tableHeaderLabel}
          />
        )),
      }))}
    />
  )
}

function TableHeaderLabelRow() {
  return (
    <DialSegmented
      axis="tableHeaderLabel"
      label="Header label"
      options={HEADER_LABEL_OPTIONS}
    />
  )
}

function AccordionContainerRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="accordionContainer"
      label="Layout"
      options={CONTAINER_OPTIONS.map((option) => ({
        ...option,
        ...sized((className) => (
          <AccordionGlyph
            className={className}
            layout={option.value}
            marker={effective.accordionMarker}
          />
        )),
      }))}
    />
  )
}

function AccordionMarkerRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="accordionMarker"
      label="Marker"
      options={MARKER_OPTIONS.map((option) => ({
        ...option,
        ...sized((className) => (
          <AccordionGlyph
            className={className}
            layout={effective.accordionContainer}
            marker={option.value}
          />
        )),
      }))}
    />
  )
}

function AvatarShapeRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="avatarShape"
      label="Shape"
      options={SHAPE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <AvatarGlyph
            shape={option.value}
            fallback={effective.avatarFallback}
          />
        ),
      }))}
    />
  )
}

function AvatarFallbackRow() {
  return (
    <DialSegmented
      axis="avatarFallback"
      label="Fallback"
      options={FALLBACK_OPTIONS}
    />
  )
}

function KbdTreatmentRow() {
  return (
    <DialSelect
      axis="kbdTreatment"
      label="Style"
      options={TREATMENT_OPTIONS.map((option) => ({
        ...option,
        preview: glyph(<KbdGlyph treatment={option.value} />),
      }))}
    />
  )
}

function CardHeaderRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="cardHeader"
      label="Header"
      options={CARD_HEADER_OPTIONS.map((option) => ({
        ...option,
        ...sized((className) => (
          <CardGlyph
            className={className}
            header={option.value}
            footer={effective.cardFooter}
          />
        )),
      }))}
    />
  )
}

function CardFooterRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="cardFooter"
      label="Footer"
      options={FOOTER_OPTIONS.map((option) => ({
        ...option,
        ...sized((className) => (
          <CardGlyph
            className={className}
            header={effective.cardHeader}
            footer={option.value}
          />
        )),
      }))}
    />
  )
}

export const ROWS: RowMap = {
  tableHeader: TableHeaderRow,
  tableHeaderLabel: TableHeaderLabelRow,
  accordionContainer: AccordionContainerRow,
  accordionMarker: AccordionMarkerRow,
  avatarShape: AvatarShapeRow,
  avatarFallback: AvatarFallbackRow,
  kbdTreatment: KbdTreatmentRow,
  cardHeader: CardHeaderRow,
  cardFooter: CardFooterRow,
}

/* --------------------------------- Section --------------------------------- */

export function DataDisplayPreview({ state }: { state: Effective }) {
  return glyph(
    <TableGlyph header={state.tableHeader} label={state.tableHeaderLabel} />,
  )
}

export function DataDisplaySection(_: { studio: Studio }) {
  return (
    <>
      <Row axis="tableHeader" />
      <Row axis="tableHeaderLabel" />
      <DialGap />
      <Row axis="selectedWash" />
      <Row axis="surfaceLayers" />
      <Row axis="displayMotion" />
      <MemberSection id="accordion" title="Accordion">
        <Row axis="accordionContainer" />
        <Row axis="accordionMarker" />
      </MemberSection>
      <MemberSection id="avatar" title="Avatar">
        <Row axis="avatarShape" />
        <Row axis="avatarFallback" />
      </MemberSection>
      <MemberSection id="kbd" title="Kbd">
        <Row axis="kbdTreatment" />
      </MemberSection>
      <MemberSection id="card" title="Card">
        <Row axis="cardHeader" />
        <Row axis="cardFooter" />
      </MemberSection>
    </>
  )
}

"use client"

/* Dialogs — one scrim for every modal layer, the panel's sections and
   actions, sheets, and dialogs on a phone. */

import { effective as resolveEffective } from "../axes"
import {
  ACTIONS_OPTIONS,
  BACKDROP_OPTIONS,
  CLOSE_OPTIONS,
  EDGE_OPTIONS,
  ENTRANCE_OPTIONS,
  FROST_OPTIONS,
  MOBILE_OPTIONS,
  POSITION_OPTIONS,
  SECTIONS_OPTIONS,
  STRENGTH_OPTIONS,
} from "../axes/dialogs.meta"
import { DialGap, DialGlyph, DialSegmented, DialSelect } from "../dial"
import { MemberSection, Row } from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective, Studio } from "../state"
import { useStudio } from "../use-studio"
import { withPhoneGlyphs } from "./phone-glyph"

/* -------------------------------- Specimens -------------------------------- */

const SCRIM_FILL: Record<string, number> = {
  light: 0.14,
  medium: 0.3,
  heavy: 0.55,
}

/** The page under an open layer: dimmed, frosted, or washed out. */
function BackdropGlyph({
  backdrop,
  strength,
}: {
  backdrop: string
  strength: string
}) {
  const fill = SCRIM_FILL[strength] ?? 0.3
  const frosted = backdrop === "frosted"
  const lines = backdrop === "wash" ? 0.45 * (1 - fill) : frosted ? 0.25 : 0.45
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={frosted ? 2.25 : 1.25}
        opacity={lines}
      >
        <path d="M6 8.5h6" />
        <path d="M6 15.5h5" />
        <path d="M15 15.5h3" />
      </g>
      {backdrop !== "wash" && (
        <rect
          x="3.75"
          y="5.75"
          width="16.5"
          height="12.5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={frosted ? fill * 0.8 : fill}
        />
      )}
      <rect x="8.5" y="9" width="7" height="5.5" rx="1" fill="currentColor" />
    </svg>
  )
}

/** A dialog panel: title, body, the footer's actions, the section edges. */
function PanelGlyph({
  sections,
  actions,
}: {
  sections: string
  actions: string
}) {
  const rule = (y: number) => (
    <path
      d={`M3.75 ${y}h16.5`}
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray={sections === "on-scroll" ? "1.5 1.25" : undefined}
      opacity=".5"
    />
  )
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {sections === "header-band" && (
        <path
          d="M3.75 9.25V6.25a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v3z"
          fill="currentColor"
          fillOpacity=".2"
        />
      )}
      {sections === "footer-band" && (
        <path
          d="M3.75 14.75h16.5v3.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5z"
          fill="currentColor"
          fillOpacity=".2"
        />
      )}
      <rect
        x="3"
        y="4"
        width="18"
        height="16.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".55"
      />
      <path
        d="M6 7h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <g stroke="currentColor" strokeLinecap="round" opacity=".45">
        <path d="M6 11.25h12" />
        {actions !== "stack" && <path d="M6 13h8" />}
      </g>
      {(sections === "divided" || sections === "on-scroll") && rule(9.25)}
      {["divided", "header-band", "on-scroll"].includes(sections) &&
        rule(14.75)}
      {sections === "footer-band" && rule(14.75)}
      {sections === "on-scroll" && (
        <path
          d="M19.25 10.5v2.75"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity=".6"
        />
      )}
      {actions === "end" && (
        <>
          <rect
            x="10"
            y="16.25"
            width="4"
            height="2"
            rx=".75"
            fill="currentColor"
            fillOpacity=".4"
          />
          <rect
            x="15"
            y="16.25"
            width="4"
            height="2"
            rx=".75"
            fill="currentColor"
          />
        </>
      )}
      {actions === "spread" && (
        <>
          <rect
            x="5"
            y="16.25"
            width="4"
            height="2"
            rx=".75"
            fill="currentColor"
            fillOpacity=".4"
          />
          <rect
            x="15"
            y="16.25"
            width="4"
            height="2"
            rx=".75"
            fill="currentColor"
          />
        </>
      )}
      {actions === "stack" && (
        <>
          <rect
            x="5"
            y="13.25"
            width="14"
            height="2"
            rx=".75"
            fill="currentColor"
          />
          <rect
            x="5"
            y="16.25"
            width="14"
            height="2"
            rx=".75"
            fill="currentColor"
            fillOpacity=".4"
          />
        </>
      )}
      {actions === "bleed" && (
        <>
          <path
            d="M3.75 15.5H12v4.25H5.25a1.5 1.5 0 0 1-1.5-1.5z"
            fill="currentColor"
            fillOpacity=".4"
          />
          <path
            d="M12 15.5h8.25v2.75a1.5 1.5 0 0 1-1.5 1.5H12z"
            fill="currentColor"
          />
        </>
      )}
    </svg>
  )
}

/** A sheet against the screen: flush to its edge or inset from it. */
function EdgeGlyph({ edge }: { edge: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
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
      {edge === "detached" ? (
        <rect
          x="5.5"
          y="11.5"
          width="13"
          height="6.5"
          rx="1.5"
          fill="currentColor"
        />
      ) : (
        <path
          d="M3.75 13a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v5.75a.5.5 0 0 1-.5.5H4.25a.5.5 0 0 1-.5-.5z"
          fill="currentColor"
        />
      )}
    </svg>
  )
}

/** The close button: a bare X, on a chip, or faint. */
function CloseGlyph({ close }: { close: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {close === "filled" && (
        <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity=".2" />
      )}
      <path
        d="M8.5 8.5l7 7M15.5 8.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity={close === "faint" ? 0.3 : 1}
      />
    </svg>
  )
}

const glyph = (node: React.ReactNode) => <DialGlyph>{node}</DialGlyph>

/* ---------------------------------- Rows ---------------------------------- */

function DialogSectionsRow() {
  const { state } = useStudio()
  return (
    <DialSelect
      axis="dialogSections"
      label="Sections"
      options={SECTIONS_OPTIONS.map((option) => ({
        ...option,
        preview: glyph(
          <PanelGlyph
            sections={option.value}
            actions={
              resolveEffective({ ...state, dialogSections: option.value })
                .values.dialogActions
            }
          />,
        ),
      }))}
    />
  )
}

function DialogBackdropRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="dialogBackdrop"
      holds={["dialogBackdropStrength", "dialogFrost"]}
      label="Backdrop"
      options={BACKDROP_OPTIONS.map((option) => ({
        ...option,
        preview: glyph(
          <BackdropGlyph
            backdrop={option.value}
            strength={effective.dialogBackdropStrength}
          />,
        ),
      }))}
    >
      <Row axis="dialogBackdropStrength" />
      <Row axis="dialogFrost" />
    </DialSelect>
  )
}

function DialogBackdropStrengthRow() {
  return (
    <DialSegmented
      axis="dialogBackdropStrength"
      label="Strength"
      options={STRENGTH_OPTIONS}
    />
  )
}

function DialogFrostRow() {
  return (
    <DialSegmented axis="dialogFrost" label="Frost" options={FROST_OPTIONS} />
  )
}

const MOBILE = withPhoneGlyphs(MOBILE_OPTIONS)

function MobileDialogsRow() {
  return <DialSelect axis="mobileDialogs" label="On mobile" options={MOBILE} />
}

const ACTIONS_ROW = ACTIONS_OPTIONS.map((option) => ({
  ...option,
  preview: glyph(<PanelGlyph sections="open" actions={option.value} />),
}))

function DialogActionsRow() {
  return (
    <DialSelect axis="dialogActions" label="Actions" options={ACTIONS_ROW} />
  )
}

const CLOSE_ROW = CLOSE_OPTIONS.map((option) => ({
  ...option,
  preview: glyph(<CloseGlyph close={option.value} />),
}))

function DialogCloseRow() {
  return <DialSelect axis="dialogClose" label="Close" options={CLOSE_ROW} />
}

function DialogEntranceRow() {
  return (
    <DialSegmented
      axis="dialogEntrance"
      label="Dialog entrance"
      options={ENTRANCE_OPTIONS}
    />
  )
}

function DialogPositionRow() {
  return (
    <DialSegmented
      axis="dialogPosition"
      label="Position"
      options={POSITION_OPTIONS}
    />
  )
}

const EDGE_ROW = EDGE_OPTIONS.map((option) => ({
  ...option,
  preview: glyph(<EdgeGlyph edge={option.value} />),
}))

function DrawerEdgeRow() {
  return <DialSelect axis="drawerEdge" label="Sheet edge" options={EDGE_ROW} />
}

export const ROWS: RowMap = {
  dialogSections: DialogSectionsRow,
  dialogBackdrop: DialogBackdropRow,
  dialogBackdropStrength: DialogBackdropStrengthRow,
  dialogFrost: DialogFrostRow,
  mobileDialogs: MobileDialogsRow,
  dialogActions: DialogActionsRow,
  dialogClose: DialogCloseRow,
  dialogEntrance: DialogEntranceRow,
  dialogPosition: DialogPositionRow,
  drawerEdge: DrawerEdgeRow,
}

/* --------------------------------- Section --------------------------------- */

export function DialogsPreview({ state }: { state: Effective }) {
  return glyph(
    <PanelGlyph
      sections={state.dialogSections}
      actions={state.dialogActions}
    />,
  )
}

export function DialogsSection(_: { studio: Studio }) {
  return (
    <>
      <Row axis="dialogSections" />
      <DialGap />
      <Row axis="dialogBackdrop" />
      <Row axis="mobileDialogs" />
      <Row axis="rolePanel" />
      <Row axis="surfaceGlass" />
      <Row axis="dialogMotion" />
      <Row axis="dialogActions" />
      <Row axis="dialogClose" />
      <Row axis="dialogEntrance" />
      <MemberSection id="modal" title="Modal">
        <Row axis="dialogPosition" />
      </MemberSection>
      <MemberSection id="drawer" title="Drawer">
        <Row axis="drawerEdge" />
      </MemberSection>
    </>
  )
}

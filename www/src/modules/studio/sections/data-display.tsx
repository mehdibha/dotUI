"use client"

/* Data display — a bucket: table, accordion, avatar, kbd. */

import { cn } from "@/registry/lib/utils"

import {
  CONTAINER_OPTIONS,
  MARKER_OPTIONS,
  POSITION_OPTIONS,
} from "../axes/accordion"
import { FALLBACK_OPTIONS, SHAPE_OPTIONS } from "../axes/avatars"
import { TREATMENT_OPTIONS } from "../axes/kbd"
import { roleLabel } from "../axes/shape"
import { HEADER_OPTIONS, SEPARATION_OPTIONS } from "../axes/tables"
import { DialGlyph, DialSegmented, DialSelect } from "../dial"
import {
  FamilyHero,
  HeroMember,
  MemberSection,
  More,
  UsesRow,
} from "../family-page"
import type { Effective, Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

/** The grid: a header band or line, then three rows divided as chosen. */
function TableGlyph({
  separation,
  header,
}: {
  separation: string
  header: string
}) {
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
      {header === "filled" && (
        <path
          d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3z"
          fill="currentColor"
          opacity=".2"
        />
      )}
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" opacity=".45" />
      {separation === "lines" && (
        <path
          d="M3 12.75h18M3 16.5h18"
          stroke="currentColor"
          strokeWidth="1"
          opacity=".35"
        />
      )}
      {separation === "striped" && (
        <rect
          x="3.75"
          y="12.75"
          width="16.5"
          height="3.5"
          fill="currentColor"
          opacity=".12"
        />
      )}
      <path
        d="M6 6.5h6M6 11h8M6 14.5h5M6 18h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".5"
      />
    </svg>
  )
}

function ContainerGlyph({ container }: { container: string }) {
  if (container === "cards")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        {[3.5, 10, 16.5].map((y) => (
          <rect
            key={y}
            x="4"
            y={y}
            width="16"
            height="4"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {container === "boxed" && (
        <rect
          x="3.75"
          y="4.25"
          width="16.5"
          height="15.5"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      <path
        d="M4 9.5h16M4 14.5h16"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".4"
      />
      {[5.75, 11, 16.25].map((y) => (
        <rect
          key={y}
          x="7"
          y={y}
          width="10"
          height="2"
          rx="1"
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

function MarkerGlyph({ marker }: { marker: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {marker === "plus" ? (
        <path d="M12 6v12M6 12h12" />
      ) : (
        <path d="M7 10l5 5 5-5" strokeLinejoin="round" />
      )}
    </svg>
  )
}

function AvatarGlyph({
  shape,
  fallback,
  large,
}: {
  shape: string
  fallback: string
  large?: boolean
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center font-semibold",
        large ? "size-6 text-[9px]" : "size-4 text-[7px]",
        shape === "circle"
          ? "rounded-full"
          : large
            ? "rounded-[7px]"
            : "rounded-[5px]",
        fallback === "tinted"
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
          rx="3"
          fill="currentColor"
          opacity=".15"
        />
      )}
      {treatment === "keycap" && (
        <>
          <rect
            x="4.5"
            y="4.5"
            width="15"
            height="13"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7.5 20.5h9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      <text
        x="12"
        y={treatment === "keycap" ? 11.5 : 12.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={treatment === "keycap" ? 7.5 : 8.5}
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

/* --------------------------------- Section --------------------------------- */

export function DataDisplayPreview({ state }: { state: Effective }) {
  return (
    <DialGlyph>
      <TableGlyph
        separation={state.tableSeparation}
        header={state.tableHeader}
      />
    </DialGlyph>
  )
}

export function DataDisplaySection({ studio }: { studio: Studio }) {
  const { effective } = studio
  return (
    <>
      <FamilyHero>
        <HeroMember name="Table">
          <DialGlyph>
            <TableGlyph
              separation={effective.tableSeparation}
              header={effective.tableHeader}
            />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Accordion">
          <DialGlyph>
            <ContainerGlyph container={effective.accordionContainer} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Avatar">
          <AvatarGlyph
            shape={effective.avatarShape}
            fallback={effective.avatarFallback}
            large
          />
        </HeroMember>
        <HeroMember name="Kbd">
          <DialGlyph>
            <KbdGlyph treatment={effective.kbdTreatment} />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialSegmented
        axis="tableHeader"
        label="Table header"
        options={HEADER_OPTIONS}
      />
      <UsesRow
        axis="roleCard"
        label="Card corners"
        value={roleLabel(effective, "roleCard")}
      />
      <UsesRow axis="motion" label="Motion" />
      <More keys={["tableSeparation"]}>
        <DialSelect
          axis="tableSeparation"
          label="Table rows"
          options={SEPARATION_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <TableGlyph
                  separation={option.value}
                  header={effective.tableHeader}
                />
              </DialGlyph>
            ),
          }))}
        />
      </More>
      <MemberSection id="accordion" title="Accordion">
        <DialSelect
          axis="accordionContainer"
          label="Layout"
          options={CONTAINER_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <ContainerGlyph container={option.value} />
              </DialGlyph>
            ),
          }))}
        />
        <DialSelect
          axis="accordionMarker"
          label="Marker"
          options={MARKER_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <MarkerGlyph marker={option.value} />
              </DialGlyph>
            ),
          }))}
        />
        <More keys={["accordionMarkerPosition"]}>
          <DialSegmented
            axis="accordionMarkerPosition"
            label="Marker position"
            options={POSITION_OPTIONS}
          />
        </More>
      </MemberSection>
      <MemberSection id="avatar" title="Avatar">
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
        <More keys={["avatarFallback"]}>
          <DialSegmented
            axis="avatarFallback"
            label="Fallback"
            options={FALLBACK_OPTIONS}
          />
        </More>
      </MemberSection>
      <MemberSection id="kbd" title="Kbd">
        <More keys={["kbdTreatment"]}>
          <DialSelect
            axis="kbdTreatment"
            label="Style"
            options={TREATMENT_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <KbdGlyph treatment={option.value} />
                </DialGlyph>
              ),
            }))}
          />
        </More>
      </MemberSection>
    </>
  )
}

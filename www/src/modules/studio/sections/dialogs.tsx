"use client"

/* Dialogs — the scrim, where a modal rests and how it arrives, and dialogs on
   a phone. */

import {
  BACKDROP_OPTIONS,
  ENTRANCE_OPTIONS,
  POSITION_OPTIONS,
} from "../axes/dialogs"
import { DIALOG_OPTIONS } from "../axes/mobile"
import { roleLabel } from "../axes/shape"
import {
  DialGap,
  DialGlyph,
  DialList,
  DialSegmented,
  DialSelect,
} from "../dial"
import {
  FamilyHero,
  HeroMember,
  MemberSection,
  More,
  UsesRow,
} from "../family-page"
import type { Effective, Studio } from "../state"
import { PhoneGlyph, withPhoneGlyphs } from "./phone-glyph"

/* -------------------------------- Specimens -------------------------------- */

/** The viewport under an open layer: dimmed away, frosted, or crisp. */
function BackdropGlyph({ backdrop }: { backdrop: string }) {
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
      {backdrop !== "dim" && (
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={backdrop === "blur" ? 2.25 : 1.25}
          opacity={backdrop === "blur" ? 0.25 : 0.45}
        >
          <path d="M6 8.5h6" />
          <path d="M6 15.5h5" />
          <path d="M15 15.5h3" />
        </g>
      )}
      {backdrop !== "none" && (
        <rect
          x="3.75"
          y="5.75"
          width="16.5"
          height="12.5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={backdrop === "dim" ? 0.32 : 0.15}
        />
      )}
      <rect x="8.5" y="9" width="7" height="5.5" rx="1" fill="currentColor" />
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

const DIALOGS = withPhoneGlyphs(DIALOG_OPTIONS)

export function DialogsPreview({ state }: { state: Effective }) {
  return (
    <DialGlyph>
      <BackdropGlyph backdrop={state.dialogBackdrop} />
    </DialGlyph>
  )
}

export function DialogsSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  return (
    <>
      <FamilyHero>
        <HeroMember name="Dialog">
          <DialGlyph>
            <BackdropGlyph backdrop={effective.dialogBackdrop} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Dialog on mobile">
          <DialGlyph>
            <PhoneGlyph
              layer={effective.mobileDialogs === "sheet" ? "sheet" : "center"}
            />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="dialogBackdrop"
        label="Backdrop"
        options={BACKDROP_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <BackdropGlyph backdrop={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialGap />
      <UsesRow
        axis="rolePanel"
        label="Panel corners"
        value={roleLabel(effective, "rolePanel")}
      />
      <UsesRow axis="surfaceGlass" label="Glass" />
      <UsesRow axis="motion" label="Motion" />
      <MemberSection id="modal" title="Modal">
        <More keys={["dialogPosition", "dialogEntrance"]}>
          <DialSegmented
            axis="dialogPosition"
            label="Position"
            options={POSITION_OPTIONS}
          />
          <DialSegmented
            axis="dialogEntrance"
            label="Entrance"
            options={ENTRANCE_OPTIONS}
          />
        </More>
      </MemberSection>
      <MemberSection id="mobile" title="On mobile">
        <DialSelect axis="mobileDialogs" label="Dialogs" options={DIALOGS} />
      </MemberSection>
    </>
  )
}

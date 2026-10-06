"use client"

/* Selection — check controls, choice cards, slider. */

import { cn } from "@/registry/lib/utils"

import { CORNER_OPTIONS } from "../axes/checkbox"
import { CONTROL_OPTIONS, SELECTED_OPTIONS } from "../axes/choice-cards"
import { THUMB_OPTIONS, TRACK_OPTIONS } from "../axes/sliders"
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

const CORNER_RX: Record<string, number> = { rounded: 3.5, square: 1, circle: 7 }

/** A checked box at one corner geometry. */
function CornerGlyph({ corner }: { corner: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx={CORNER_RX[corner] ?? 3.5}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m9 12.3 2.1 2.1 4-4.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A chosen radio and an on switch: members with no rows of their own yet. */
function RadioGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  )
}

function SwitchGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.75"
        y="7.25"
        width="18.5"
        height="9.5"
        rx="4.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="16.5" cy="12" r="2.75" fill="currentColor" />
    </svg>
  )
}

const CARD_LOOK: Record<string, string> = {
  outline: "border-primary shadow-[inset_0_0_0_1px_var(--color-primary)]",
  tint: "border-fg/10 bg-primary/10",
  "outline-tint":
    "border-primary bg-primary/10 shadow-[inset_0_0_0_1px_var(--color-primary)]",
}

/** A chosen card: its selected treatment, the control where it sits. */
function CardGlyph({
  selected,
  control,
}: {
  selected: string
  control: string
}) {
  return (
    <span
      className={cn(
        "flex h-4 w-8 shrink-0 items-center gap-1.5 rounded-md border px-1",
        control === "end" && "flex-row-reverse",
        CARD_LOOK[selected],
      )}
    >
      {control !== "hidden" && (
        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
      )}
      <span className="h-1 flex-1 rounded-full bg-fg/25" />
    </span>
  )
}

function ThumbGlyph({ thumb, track }: { thumb: string; track: string }) {
  const weight = track === "thick" ? 5 : 2
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {thumb === "bar" ? (
        <>
          <path
            d="M3 12h5.5M15.5 12h5.5"
            stroke="currentColor"
            strokeWidth={weight}
            strokeLinecap="round"
            opacity=".4"
          />
          <rect
            x="10.75"
            y="6.5"
            width="2.5"
            height="11"
            rx="1.25"
            fill="currentColor"
          />
        </>
      ) : (
        <>
          <path
            d="M3 12h18"
            stroke="currentColor"
            strokeWidth={weight}
            strokeLinecap="round"
            opacity=".4"
          />
          {thumb === "outline" ? (
            <circle
              cx="13.5"
              cy="12"
              r="3.5"
              fill="var(--color-bg)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ) : (
            <circle cx="13.5" cy="12" r="4" fill="currentColor" />
          )}
        </>
      )}
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function SelectionPreview({ state }: { state: Effective }) {
  return (
    <DialGlyph>
      <CornerGlyph corner={state.checkCorner} />
    </DialGlyph>
  )
}

export function SelectionSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  return (
    <>
      <FamilyHero>
        <HeroMember name="Checkbox">
          <DialGlyph>
            <CornerGlyph corner={effective.checkCorner} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Radio">
          <DialGlyph>
            <RadioGlyph />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Switch">
          <DialGlyph>
            <SwitchGlyph />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Choice card">
          <CardGlyph
            selected={effective.cardSelected}
            control={effective.cardControl}
          />
        </HeroMember>
        <HeroMember name="Slider">
          <DialGlyph>
            <ThumbGlyph
              thumb={effective.sliderThumb}
              track={effective.sliderTrack}
            />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <UsesRow axis="checkboxColor" label="Checked color" />
      <UsesRow axis="motion" label="Motion" />
      <More keys={["checkCorner"]}>
        <DialSelect
          axis="checkCorner"
          label="Checkbox corner"
          options={CORNER_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <CornerGlyph corner={option.value} />
              </DialGlyph>
            ),
          }))}
        />
      </More>
      <MemberSection id="slider" title="Slider">
        <DialSelect
          axis="sliderThumb"
          label="Thumb"
          options={THUMB_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <ThumbGlyph
                  thumb={option.value}
                  track={effective.sliderTrack}
                />
              </DialGlyph>
            ),
          }))}
        />
        <More keys={["sliderTrack"]}>
          <DialSegmented
            axis="sliderTrack"
            label="Track"
            options={TRACK_OPTIONS}
          />
        </More>
      </MemberSection>
      <MemberSection id="choice-card" title="Choice cards">
        <DialSelect
          axis="cardSelected"
          label="Selected"
          options={SELECTED_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <CardGlyph
                selected={option.value}
                control={effective.cardControl}
              />
            ),
          }))}
        />
        <More keys={["cardControl"]}>
          <DialSegmented
            axis="cardControl"
            label="Control"
            options={CONTROL_OPTIONS}
          />
        </More>
      </MemberSection>
    </>
  )
}

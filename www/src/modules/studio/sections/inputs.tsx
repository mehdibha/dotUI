"use client"

/* Inputs — Style and Hover reach every field; focus lives in States. */

import { cn } from "@/registry/lib/utils"

import { HOVER_OPTIONS, STYLE_OPTIONS } from "../axes/inputs"
import { NUMBER_LAYOUT_OPTIONS } from "../axes/number-field"
import { OTP_STYLE_OPTIONS } from "../axes/otp-field"
import { CARET_OPTIONS } from "../axes/pickers"
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
import type { Effective, Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

const SHELL: Record<string, string> = {
  outline: "rounded-md border border-border-control bg-field",
  line: "border-b border-border-control",
  "filled-line-bottom": "rounded-t-md border-b border-border-control bg-field",
  filled: "rounded-md bg-field",
}

/** A field wearing one shell, with a line of placeholder. */
function FieldGlyph({ style, large }: { style: string; large?: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center",
        large ? "h-6 w-20 px-2" : "h-4 w-7 px-1",
        SHELL[style],
      )}
    >
      <span
        className={cn("rounded-full bg-fg/25", large ? "h-1.5 w-8" : "h-1 w-3")}
      />
    </span>
  )
}

/* The group's two keys read as one pick; the divider only exists on a cell. */
const ADDON_OPTIONS = [
  { value: "inside", label: "Inside" },
  { value: "boxed", label: "Boxed" },
  { value: "boxed-flush", label: "Boxed, flush" },
]

function addonValue(state: StudioState) {
  if (state.addonLayout !== "boxed") return "inside"
  return state.addonDivider === "none" ? "boxed-flush" : "boxed"
}

/** A field with its prefix: floating inside, or a cell on the edge. */
function AddonGlyph({ addon }: { addon: string }) {
  return (
    <span className="flex h-4 w-8 shrink-0 overflow-hidden rounded-[4px] border border-fg/30">
      <span
        className={cn(
          "flex w-3 items-center justify-center",
          addon !== "inside" && "bg-fg/10",
          addon === "boxed" && "border-r border-fg/30",
        )}
      >
        <span className="size-1 rounded-full bg-fg/50" />
      </span>
    </span>
  )
}

/** The field with its steppers where the layout puts them. */
function SteppersGlyph({ layout }: { layout: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2.5" y="7" width="19" height="10" rx="2" />
      {layout === "right" && (
        <>
          <path d="M11.5 7v10M16.5 7v10" opacity=".5" />
          <path d="M13 12h2M18 12h2M19 11v2" />
        </>
      )}
      {layout === "split" && (
        <>
          <path d="M7.5 7v10M16.5 7v10" opacity=".5" />
          <path d="M4 12h2M18 12h2M19 11v2" />
        </>
      )}
      {layout === "stacked" && (
        <>
          <path d="M15.5 7v10" opacity=".5" />
          <path d="m16.75 10.75 1.75-1.5 1.75 1.5M16.75 13.25l1.75 1.5 1.75-1.5" />
        </>
      )}
    </svg>
  )
}

/** Three digit cells: one group, separate boxes, or a dash each. */
function CellsGlyph({ cells }: { cells: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      {cells === "group" && (
        <>
          <rect x="2.5" y="7" width="19" height="10" rx="2" />
          <path d="M8.75 7v10M15.25 7v10" opacity=".5" />
        </>
      )}
      {cells === "boxes" && (
        <>
          <rect x="2.5" y="7" width="5.5" height="10" rx="1.5" />
          <rect x="9.25" y="7" width="5.5" height="10" rx="1.5" />
          <rect x="16" y="7" width="5.5" height="10" rx="1.5" />
        </>
      )}
      {cells === "underline" && (
        <path d="M3 16h5M9.5 16h5M16 16h5" strokeWidth="2" />
      )}
    </svg>
  )
}

function CaretGlyph({ caret }: { caret: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {caret === "double" ? (
        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
      ) : (
        <path d="m6 9 6 6 6-6" />
      )}
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function InputsPreview({ state }: { state: Effective }) {
  return <FieldGlyph style={state.inputStyle} />
}

export function InputsSection({ studio }: { studio: Studio }) {
  const { state, effective, setState } = studio
  const setAddon = (addon: string) =>
    setState({
      ...state,
      addonLayout: addon === "inside" ? "inside" : "boxed",
      addonDivider:
        addon === "inside"
          ? state.addonDivider
          : addon === "boxed-flush"
            ? "none"
            : "hairline",
    })
  return (
    <>
      <FamilyHero>
        <HeroMember name="Input">
          <FieldGlyph style={effective.inputStyle} large />
        </HeroMember>
        <HeroMember name="Input group">
          <AddonGlyph addon={addonValue(state)} />
        </HeroMember>
        <HeroMember name="Number field">
          <DialGlyph>
            <SteppersGlyph layout={effective.numberLayout} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="OTP field">
          <DialGlyph>
            <CellsGlyph cells={effective.otpStyle} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Select">
          <DialGlyph>
            <CaretGlyph caret={effective.pickerCaret} />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="inputStyle"
        label="Style"
        options={STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: <FieldGlyph style={option.value} large />,
        }))}
      />
      <DialGap />
      <UsesRow axis="controlStroke" label="Control stroke" />
      <UsesRow axis="focusInputStyle" label="Field focus" />
      <UsesRow axis="inputError" label="Invalid" />
      <More keys={["inputHover", "addonLayout", "addonDivider"]}>
        <DialSegmented
          axis="inputHover"
          label="Hover"
          options={HOVER_OPTIONS}
        />
        <DialSelect
          label="Addons"
          value={addonValue(state)}
          onChange={setAddon}
          options={ADDON_OPTIONS.map((option) => ({
            ...option,
            preview: <AddonGlyph addon={option.value} />,
          }))}
        />
      </More>
      <MemberSection id="number-field" title="Number field">
        <DialSelect
          axis="numberLayout"
          label="Steppers"
          options={NUMBER_LAYOUT_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <SteppersGlyph layout={option.value} />
              </DialGlyph>
            ),
          }))}
        />
      </MemberSection>
      <MemberSection id="otp" title="OTP field">
        <DialSelect
          axis="otpStyle"
          label="Cells"
          options={OTP_STYLE_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <CellsGlyph cells={option.value} />
              </DialGlyph>
            ),
          }))}
        />
      </MemberSection>
      <MemberSection id="select" title="Select">
        <More keys={["pickerCaret"]}>
          <DialSelect
            axis="pickerCaret"
            label="Caret"
            options={CARET_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <CaretGlyph caret={option.value} />
                </DialGlyph>
              ),
            }))}
          />
        </More>
      </MemberSection>
    </>
  )
}

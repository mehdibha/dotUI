"use client"

/* Inputs — the field shell every text field, picker trigger and OTP cell
   wears; members decide structure. Focus and invalid live in States. */

import { DesignSystemContext } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles } from "@/registry/ui/input/styles"

import { STYLE_OPTIONS as BUTTON_STYLE_OPTIONS } from "../axes/buttons.meta"
import { ERROR_OPTIONS, LABEL_OPTIONS } from "../axes/field.meta"
import { AUTO_STYLE } from "../axes/inputs"
import {
  HEIGHT_OPTIONS,
  HOVER_OPTIONS,
  STYLE_OPTIONS,
} from "../axes/inputs.meta"
import { NUMBER_LAYOUT_OPTIONS } from "../axes/number-field.meta"
import { OTP_STYLE_OPTIONS } from "../axes/otp-field.meta"
import { CARET_OPTIONS, TRIGGER_OPTIONS } from "../axes/select.meta"
import { roleLabel } from "../axes/shape"
import { DialGap, DialGlyph, DialList, DialSelect } from "../dial"
import {
  FamilyHero,
  HeroMember,
  MemberSection,
  More,
  UsesRow,
} from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective, Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

/* One stable context per shell × hover, so the registry's style cache hits. */
const contexts = new Map<
  string,
  { params: { input: { style: string; hover: string } }; density: "default" }
>()
function shellContext(style: string, hover: string) {
  const id = `${style}|${hover}`
  let context = contexts.get(id)
  if (!context)
    contexts.set(
      id,
      (context = { params: { input: { style, hover } }, density: "default" }),
    )
  return context
}

function Shell({ className }: { className?: string }) {
  const { input } = useStyles()()
  return (
    <span className={input({ size: "sm", className })}>
      <span className="h-1.5 w-8 rounded-full bg-fg/25" />
    </span>
  )
}

/** A field drawn by the registry's own recipe for one shell. */
function ShellSpecimen({
  style,
  hover = "none",
  className,
}: {
  style: string
  hover?: string
  className?: string
}) {
  return (
    <DesignSystemContext.Provider value={shellContext(style, hover)}>
      <Shell className={cn("pointer-events-none w-20", className)} />
    </DesignSystemContext.Provider>
  )
}

/** The value an Auto or As-style row resolves from, as a plain tag. */
function SourceTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-fg/8 px-1.5 text-xs font-medium text-fg/60">
      {children}
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
      {layout === "right-cells" && (
        <>
          <path d="M17 10.75v2.5" opacity=".5" />
          <path d="M14 12h1.5M18.25 12h1.5M19 11.25v1.5" />
        </>
      )}
      {layout === "split" && (
        <>
          <path d="M7 7v10M17 7v10" opacity=".5" />
          <path d="M4 12h1.5M18.5 12h1.5M19.25 11.25v1.5" />
        </>
      )}
      {layout === "stacked-cells" && (
        <>
          <path d="M16 7v10M16 12h5.5" opacity=".5" />
          <path d="m17.5 10.25 1.25-1 1.25 1M17.5 13.75l1.25 1 1.25-1" />
        </>
      )}
      {layout === "stacked-inset" && (
        <>
          <rect x="16" y="8.5" width="4" height="3" rx="1" opacity=".5" />
          <rect x="16" y="12.5" width="4" height="3" rx="1" opacity=".5" />
        </>
      )}
    </svg>
  )
}

/** Three digit cells: one attached row, or separate cells. */
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
      {cells === "attached" ? (
        <>
          <rect x="2.5" y="7" width="19" height="10" rx="2" />
          <path d="M8.75 7v10M15.25 7v10" opacity=".5" />
        </>
      ) : (
        <>
          <rect x="2.5" y="7" width="5.5" height="10" rx="1.5" />
          <rect x="9.25" y="7" width="5.5" height="10" rx="1.5" />
          <rect x="16" y="7" width="5.5" height="10" rx="1.5" />
        </>
      )}
    </svg>
  )
}

/** A select trigger: the field's outline or a button's fill, with its caret. */
function TriggerGlyph({ trigger, caret }: { trigger: string; caret: string }) {
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
      {trigger === "field" ? (
        <rect x="2.5" y="7" width="19" height="10" rx="2" />
      ) : (
        <rect
          x="2.5"
          y="7"
          width="19"
          height="10"
          rx="2"
          fill="currentColor"
          fillOpacity=".15"
          stroke="none"
        />
      )}
      <path d="M5.5 12h6" opacity=".5" />
      {caret === "double" ? (
        <path d="m15.5 13.25 2 1.5 2-1.5M15.5 10.75l2-1.5 2 1.5" />
      ) : (
        <path d="m15.5 11 2 2 2-2" />
      )}
    </svg>
  )
}

const WEIGHT: Record<string, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
}

/** A field label at one weight. */
function LabelGlyph({ weight }: { weight: string }) {
  return (
    <span className={cn("shrink-0 text-xs text-fg/80", WEIGHT[weight])}>
      Label
    </span>
  )
}

/** A field with its error: plain, an icon on the message, or in the field. */
function ErrorGlyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="text-fg-danger">
      <rect
        x="3.75"
        y="4.5"
        width="16.5"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {kind === "icon-field" && (
        <circle cx="16.5" cy="8.5" r="1.75" fill="currentColor" />
      )}
      {kind === "icon-message" && (
        <circle cx="5.5" cy="17.25" r="1.4" fill="currentColor" />
      )}
      <path
        d={kind === "icon-message" ? "M9 17.25h7.5" : "M4.5 17.25h9"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function InputsPreview({ state }: { state: Effective }) {
  return <ShellSpecimen style={state.inputStyle} className="h-5 w-10" />
}

export function InputsSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  const autoStyle = AUTO_STYLE[effective.buttonStyle] ?? "outline"
  return (
    <>
      <FamilyHero>
        <HeroMember name="Input">
          <ShellSpecimen
            style={effective.inputStyle}
            hover={effective.inputHover}
          />
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
            <TriggerGlyph
              trigger={effective.selectTrigger}
              caret={effective.pickerCaret}
            />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Field">
          <LabelGlyph weight={effective.fieldLabel} />
          <DialGlyph>
            <ErrorGlyph kind={effective.inputError} />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="inputStyle"
        label="Style"
        options={[
          {
            value: "auto",
            label: `Auto · ${labelOf(STYLE_OPTIONS, autoStyle)}`,
            aside: (
              <SourceTag>
                {labelOf(BUTTON_STYLE_OPTIONS, effective.buttonStyle)}
              </SourceTag>
            ),
            preview: <ShellSpecimen style={autoStyle} className="w-12" />,
          },
          ...STYLE_OPTIONS.map((option) => ({
            ...option,
            preview: <ShellSpecimen style={option.value} className="w-12" />,
          })),
        ]}
      />
      <DialGap />
      <UsesRow axis="buttonStyle" label="Buttons" />
      <UsesRow axis="focusInputStyle" label="Field focus" />
      <UsesRow
        axis="roleControl"
        label="Control corners"
        value={roleLabel(effective, "roleControl")}
      />
      <More keys={["inputHover", "inputHeight"]}>
        <DialSelect
          axis="inputHover"
          label="Hover"
          options={[{ value: "auto", label: "As style" }, ...HOVER_OPTIONS]}
        />
        <DialSelect
          axis="inputHeight"
          label="Height"
          options={HEIGHT_OPTIONS}
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
        <More keys={["selectTrigger", "pickerCaret"]}>
          <DialSelect
            axis="selectTrigger"
            label="Trigger"
            options={TRIGGER_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <TriggerGlyph
                    trigger={option.value}
                    caret={effective.pickerCaret}
                  />
                </DialGlyph>
              ),
            }))}
          />
          <DialSelect
            axis="pickerCaret"
            label="Caret"
            options={CARET_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <TriggerGlyph
                    trigger={effective.selectTrigger}
                    caret={option.value}
                  />
                </DialGlyph>
              ),
            }))}
          />
        </More>
      </MemberSection>
      <MemberSection id="field" title="Field">
        <More keys={["fieldLabel", "inputError"]}>
          <DialSelect
            axis="fieldLabel"
            label="Label"
            options={LABEL_OPTIONS.map((option) => ({
              ...option,
              preview: <LabelGlyph weight={option.value} />,
            }))}
          />
          <DialSelect
            axis="inputError"
            label="Error message"
            options={ERROR_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <ErrorGlyph kind={option.value} />
                </DialGlyph>
              ),
            }))}
          />
        </More>
      </MemberSection>
    </>
  )
}

export const ROWS: RowMap = {}

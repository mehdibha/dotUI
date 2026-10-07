"use client"

/* Selection — checkbox, radio, switch, slider and choice cards, each drawn by
   its registry recipe. */

import { CheckIcon } from "lucide-react"

import { DesignSystemContext } from "@/lib/styles"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { useStyles as useRadioStyles } from "@/registry/ui/radio-group/styles"
import { useStyles as useSliderStyles } from "@/registry/ui/slider/styles"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"

import { effective as resolve } from "../axes"
import { cornerTokens, edgeTokens } from "../axes/checkbox"
import { CORNER_OPTIONS, EDGE_OPTIONS } from "../axes/checkbox.meta"
import { CARD_COLOR_ROW, SELECTED_OPTIONS } from "../axes/choice-cards.meta"
import { MARK_OPTIONS } from "../axes/radio.meta"
import { THUMB_OPTIONS, TRACK_OPTIONS } from "../axes/sliders.meta"
import { STYLE_OPTIONS } from "../axes/switch.meta"
import { DialSelect } from "../dial"
import {
  FamilyHero,
  HeroMember,
  MemberSection,
  More,
  UsesRow,
} from "../family-page"
import type { Effective, Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

type Context = React.ContextType<typeof DesignSystemContext>

/* One stable context per selection, so the registry's style cache hits. */
const CONTEXTS = new Map<string, Context>()
function paramContext(name: string, params: Record<string, string>) {
  const key = `${name}:${JSON.stringify(params)}`
  let context = CONTEXTS.get(key)
  if (!context) {
    context = { params: { [name]: params }, density: "default" }
    CONTEXTS.set(key, context)
  }
  return context
}

function Recipe({
  name,
  params,
  children,
}: {
  name: string
  params: Record<string, string>
  children: React.ReactNode
}) {
  return (
    <DesignSystemContext.Provider value={paramContext(name, params)}>
      {children}
    </DesignSystemContext.Provider>
  )
}

const ON = { "data-selected": "true" }

function CheckboxMark({
  corner,
  edge,
  controlEdge = "firm",
}: {
  corner: string
  edge?: string
  controlEdge?: string
}) {
  const { indicator } = useCheckboxStyles()()
  return (
    <span
      {...(edge ? {} : ON)}
      className={indicator()}
      style={
        {
          ...cornerTokens(corner),
          ...(edge && edgeTokens(edge, controlEdge)),
        } as React.CSSProperties
      }
    >
      <CheckIcon />
    </span>
  )
}

function RadioMark() {
  const { indicator } = useRadioStyles()()
  return <span {...ON} className={indicator()} />
}

function SwitchTrack({ on }: { on?: boolean }) {
  const { indicator, thumb } = useSwitchStyles()()
  const state = on ? ON : {}
  return (
    <span {...state} className={indicator({ size: "sm" })}>
      <span {...state} className={thumb({ size: "sm" })} />
    </span>
  )
}

function SliderBar() {
  const { control, track, fill, thumb } = useSliderStyles()()
  const orientation = "horizontal"
  return (
    <span
      className={control({ orientation, className: "min-h-0 w-12 grow-0" })}
    >
      <span className={track({ orientation })}>
        <span
          className={fill()}
          style={{ position: "absolute", insetBlock: 0, width: "60%" }}
        />
      </span>
      <span
        className={thumb({ orientation, className: "before:inset-y-[-5px]" })}
        style={{
          position: "absolute",
          left: "60%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </span>
  )
}

/* What the `choice-card` scope re-declares, on the specimen. */
const ACCENT_CARD = {
  "--color-selection": "var(--color-accent)",
  "--color-selection-hover": "var(--color-accent-hover)",
  "--color-selection-muted": "var(--color-accent-muted)",
  "--color-fg-on-selection": "var(--color-fg-on-accent)",
} as React.CSSProperties

function ChoiceCard({ accent }: { accent: boolean }) {
  const { control, indicator } = useCheckboxStyles()()
  return (
    <span
      {...ON}
      style={accent ? ACCENT_CARD : undefined}
      className={control({
        className: "gap-1 has-data-label:w-10 has-data-label:p-1",
      })}
    >
      <span
        {...ON}
        className={indicator({ className: "size-2.5 *:[svg]:size-2" })}
      >
        <CheckIcon />
      </span>
      <span data-label className="h-1 flex-1 rounded-full bg-fg/25" />
    </span>
  )
}

const corner = (value: string) => (
  <Recipe name="checkbox" params={{}}>
    <CheckboxMark corner={value} />
  </Recipe>
)

const edge = (value: string, controlEdge: string) => (
  <Recipe name="checkbox" params={{}}>
    <CheckboxMark corner="auto" edge={value} controlEdge={controlEdge} />
  </Recipe>
)

const mark = (value: string) => (
  <Recipe name="radio-group" params={{ mark: value }}>
    <RadioMark />
  </Recipe>
)

const switchStyle = (value: string) => (
  <Recipe name="switch" params={{ style: value }}>
    <span className="flex gap-1">
      <SwitchTrack />
      <SwitchTrack on />
    </span>
  </Recipe>
)

const slider = (thumb: string, track: string) => (
  <Recipe name="slider" params={{ thumb, track }}>
    <SliderBar />
  </Recipe>
)

const card = (value: string, accent: boolean) => (
  <Recipe name="checkbox" params={{ "card-selected": value }}>
    <ChoiceCard accent={accent} />
  </Recipe>
)

/* --------------------------------- Section --------------------------------- */

export function SelectionPreview({ state }: { state: Effective }) {
  return mark(state.radioMark)
}

export function SelectionSection({ studio }: { studio: Studio }) {
  const { state, effective } = studio
  // A thumb's specimen rides the track it would resolve to.
  const trackFor = (thumb: string) =>
    resolve({ ...state, sliderThumb: thumb }).values.sliderTrack
  const accentCards = effective.cardColor === "accent"
  return (
    <>
      <FamilyHero>
        <HeroMember name="Checkbox">{corner(effective.checkCorner)}</HeroMember>
        <HeroMember name="Radio">{mark(effective.radioMark)}</HeroMember>
        <HeroMember name="Switch">
          {switchStyle(effective.switchStyle)}
        </HeroMember>
        <HeroMember name="Slider">
          {slider(effective.sliderThumb, effective.sliderTrack)}
        </HeroMember>
        <HeroMember name="Choice card">
          {card(effective.cardSelected, accentCards)}
        </HeroMember>
      </FamilyHero>
      <UsesRow axis="checkboxColor" label="Checked color" />
      <UsesRow axis="controlEdge" label="Control edge" />
      <UsesRow axis="controlStroke" label="Control stroke" />
      <UsesRow axis="motion" label="Motion" />
      <More keys={["checkCorner", "checkEdge"]}>
        <DialSelect
          axis="checkCorner"
          label="Checkbox corner"
          options={CORNER_OPTIONS.map((option) => ({
            ...option,
            preview: corner(option.value),
          }))}
        />
        <DialSelect
          axis="checkEdge"
          label="Check edge"
          options={EDGE_OPTIONS.map((option) => ({
            ...option,
            preview: edge(option.value, effective.controlEdge),
          }))}
        />
      </More>
      <MemberSection id="radio" title="Radio">
        <DialSelect
          axis="radioMark"
          label="Mark"
          options={MARK_OPTIONS.map((option) => ({
            ...option,
            preview: mark(option.value),
          }))}
        />
      </MemberSection>
      <MemberSection id="switch" title="Switch">
        <DialSelect
          axis="switchStyle"
          label="Style"
          options={STYLE_OPTIONS.map((option) => ({
            ...option,
            preview: switchStyle(option.value),
          }))}
        />
      </MemberSection>
      <MemberSection id="slider" title="Slider">
        <DialSelect
          axis="sliderThumb"
          label="Thumb"
          options={THUMB_OPTIONS.map((option) => ({
            ...option,
            preview: slider(option.value, trackFor(option.value)),
          }))}
        />
        <More keys={["sliderTrack"]}>
          <DialSelect
            axis="sliderTrack"
            label="Track"
            options={TRACK_OPTIONS.map((option) => ({
              ...option,
              preview:
                option.value === "auto"
                  ? undefined
                  : slider(effective.sliderThumb, option.value),
            }))}
          />
        </More>
      </MemberSection>
      <MemberSection id="choice-card" title="Choice cards">
        <DialSelect
          axis="cardSelected"
          label="Selected"
          options={SELECTED_OPTIONS.map((option) => ({
            ...option,
            preview: card(option.value, accentCards),
          }))}
        />
        <More keys={["cardColor"]}>
          <DialSelect
            axis="cardColor"
            label="Color"
            options={CARD_COLOR_ROW.map((option) => ({
              ...option,
              preview: card(effective.cardSelected, option.value === "accent"),
            }))}
          />
        </More>
      </MemberSection>
    </>
  )
}

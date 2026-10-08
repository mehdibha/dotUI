"use client"

import { Fragment, useEffect, useState } from "react"

import { CheckIcon, MinusIcon } from "@/registry/icons"
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Description, FieldContent, Label } from "@/registry/ui/field"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import { useStyles as useRadioStyles } from "@/registry/ui/radio-group/styles"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { useStyles as useSliderStyles } from "@/registry/ui/slider/styles"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"

import {
  Board,
  BoardSection,
  StateRow,
  stateProps,
  useBoardFocus,
} from "./board"
import type { StateName } from "./board"

const SPEC_LABEL = "text-[11px] text-fg-muted"

const STACK =
  "@container flex-col flex-nowrap items-stretch justify-start gap-10"

/** Live components beside their frozen states; stacked in narrow sections. */
const SPLIT =
  "grid items-center gap-10 @2xl:grid-cols-[minmax(0,1fr)_auto] @2xl:gap-12"

const LIVE = "justify-self-center @2xl:justify-self-start"

type Attrs = Record<string, string>

/** StateRow's frozen states, one row per value (unchecked, checked…). */
function StateGrid({
  rows,
  states,
  children,
}: {
  rows: readonly { label: string; attrs: Attrs }[]
  states: readonly StateName[]
  children: (attrs: Attrs) => React.ReactNode
}) {
  return (
    <div
      inert
      className="grid items-center justify-center gap-x-3 gap-y-4 justify-self-center @md:gap-x-5"
      style={{ gridTemplateColumns: `auto repeat(${states.length}, auto)` }}
    >
      <span />
      {states.map((state) => (
        <span key={state} className={`${SPEC_LABEL} text-center`}>
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </span>
      ))}
      {rows.map((row) => (
        <Fragment key={row.label}>
          <span className={`${SPEC_LABEL} pe-1`}>{row.label}</span>
          {states.map((state) => (
            <span key={state} className="flex justify-center">
              {children({ ...stateProps(state), ...row.attrs })}
            </span>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

const SELECTED = { "data-selected": "true" }

function FrozenCheckbox(attrs: Attrs) {
  const { root, control, indicator } = useCheckboxStyles()()
  return (
    <span data-checkbox="" className={root()}>
      <span {...attrs} className={control()}>
        <span {...attrs} className={indicator()}>
          {attrs["data-indeterminate"] ? <MinusIcon /> : <CheckIcon />}
        </span>
      </span>
    </span>
  )
}

function CheckboxSection() {
  return (
    <BoardSection
      member="checkbox"
      title="Checkbox"
      axes={[
        "checkboxColor",
        "controlEdge",
        "controlStroke",
        "checkCorner",
        "checkEdge",
      ]}
      className={STACK}
    >
      <div className={SPLIT}>
        <CheckboxGroup defaultValue={["mentions", "digest"]} className={LIVE}>
          <Label>Email me about</Label>
          <Checkbox value="mentions">Mentions and replies</Checkbox>
          <Checkbox value="digest">Weekly digest</Checkbox>
          <Checkbox value="product">Product updates</Checkbox>
          <Checkbox value="billing" isDisabled>
            Billing receipts
          </Checkbox>
        </CheckboxGroup>
        <StateGrid
          rows={[
            { label: "Off", attrs: {} },
            { label: "On", attrs: SELECTED },
            { label: "Mixed", attrs: { "data-indeterminate": "true" } },
          ]}
          states={["rest", "focus", "disabled", "invalid"]}
        >
          {(attrs) => <FrozenCheckbox {...attrs} />}
        </StateGrid>
      </div>
    </BoardSection>
  )
}

function FrozenRadio(attrs: Attrs) {
  const { root, control, indicator } = useRadioStyles()()
  return (
    <span data-radio="" className={root()}>
      <span {...attrs} className={control()}>
        <span {...attrs} className={indicator()}>
          <span />
        </span>
      </span>
    </span>
  )
}

function RadioSection() {
  return (
    <BoardSection
      member="radio"
      title="Radio"
      axes={["radioMark", "radioColor"]}
      className={STACK}
    >
      <div className={SPLIT}>
        <RadioGroup defaultValue="yearly" className={LIVE}>
          <Label>Billing cycle</Label>
          <Radio value="monthly">Monthly</Radio>
          <Radio value="yearly">Yearly, save 20%</Radio>
          <Radio value="lifetime" isDisabled>
            Lifetime
          </Radio>
        </RadioGroup>
        <StateGrid
          rows={[
            { label: "Off", attrs: {} },
            { label: "On", attrs: SELECTED },
          ]}
          states={["rest", "focus", "disabled", "invalid"]}
        >
          {(attrs) => <FrozenRadio {...attrs} />}
        </StateGrid>
      </div>
    </BoardSection>
  )
}

function FrozenSwitch(attrs: Attrs) {
  const { root, control, indicator, thumb } = useSwitchStyles()()
  return (
    <span data-switch="" className={root()}>
      <span {...attrs} className={control()}>
        <span {...attrs} className={indicator({ size: "md" })}>
          <span {...attrs} className={thumb({ size: "md" })} />
        </span>
      </span>
    </span>
  )
}

function SwitchSection() {
  return (
    <BoardSection
      member="switch"
      title="Switch"
      axes={["switchStyle", "switchColor"]}
      className={STACK}
    >
      <div className={SPLIT}>
        <div className={`flex w-full max-w-60 flex-col gap-4 ${LIVE}`}>
          {[
            { label: "Wi-Fi", on: true },
            { label: "Bluetooth", on: false },
            { label: "Airplane mode", on: false, disabled: true },
          ].map(({ label, on, disabled }) => (
            <Switch
              key={label}
              defaultSelected={on}
              isDisabled={disabled}
              className="justify-between"
            >
              <Label className="whitespace-nowrap">{label}</Label>
              <SwitchControl />
            </Switch>
          ))}
        </div>
        <StateGrid
          rows={[
            { label: "Off", attrs: {} },
            { label: "On", attrs: SELECTED },
          ]}
          states={["rest", "pressed", "focus", "disabled", "invalid"]}
        >
          {(attrs) => <FrozenSwitch {...attrs} />}
        </StateGrid>
      </div>
    </BoardSection>
  )
}

/** The slider's own slots on plain markup, its thumb at 60%. */
function FrozenSlider(attrs: Attrs) {
  const { control, track, fill, thumb } = useSliderStyles()()
  return (
    <span data-slider="" className="flex w-[4.5rem] @lg:w-28">
      <span {...attrs} className={control({ orientation: "horizontal" })}>
        <span {...attrs} className={track({ orientation: "horizontal" })}>
          <span
            {...attrs}
            className={fill()}
            style={{ position: "absolute", insetBlock: 0, width: "60%" }}
          />
        </span>
        <span
          {...attrs}
          className={thumb({ orientation: "horizontal" })}
          style={{
            position: "absolute",
            left: "60%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </span>
    </span>
  )
}

const TICKS = [0, 25, 50, 75, 100]

function SliderSection() {
  return (
    <BoardSection
      member="slider"
      title="Slider"
      axes={["sliderThumb", "sliderTrack", "sliderColor"]}
      className={STACK}
    >
      <div className="grid items-start gap-x-12 gap-y-10 @lg:grid-cols-2">
        <Slider defaultValue={60} className="w-full">
          <div className="flex items-center justify-between">
            <Label>Volume</Label>
            <SliderOutput />
          </div>
          <SliderControl />
        </Slider>
        <Slider
          defaultValue={[240, 640]}
          minValue={0}
          maxValue={1000}
          step={10}
          formatOptions={{ style: "currency", currency: "USD" }}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <Label>Price</Label>
            <SliderOutput />
          </div>
          <SliderControl />
        </Slider>
        <Slider defaultValue={50} step={25} className="w-full">
          <Label>Brush hardness</Label>
          <SliderControl />
          <div aria-hidden className="relative h-8">
            {TICKS.map((tick) => (
              <span
                key={tick}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1"
                style={{ left: `${tick}%` }}
              >
                <span className="h-1.5 w-px bg-border-control" />
                <span className={`${SPEC_LABEL} tabular-nums`}>{tick}</span>
              </span>
            ))}
          </div>
        </Slider>
        <Slider defaultValue={30} isDisabled className="w-full">
          <div className="flex items-center justify-between">
            <Label>Bass</Label>
            <SliderOutput />
          </div>
          <SliderControl />
        </Slider>
      </div>
      <StateRow states={["rest", "hover", "focus", "disabled"]}>
        {(attrs) => <FrozenSlider {...attrs} />}
      </StateRow>
    </BoardSection>
  )
}

const PLANS = [
  { id: "hobby", name: "Hobby", text: "Free for personal projects" },
  { id: "pro", name: "Pro", text: "$20 a month, for growing teams" },
  { id: "enterprise", name: "Enterprise", text: "SSO, audit logs and SLAs" },
]

function ChoiceCardsSection() {
  return (
    <BoardSection
      member="choice-card"
      title="Choice cards"
      axes={["cardSelected", "cardColor"]}
      className={STACK}
    >
      <div className="flex flex-col gap-3">
        <RadioGroup defaultValue="pro" aria-label="Plan">
          <div className="grid gap-3 @xl:grid-cols-3">
            {PLANS.map((plan) => (
              <Radio key={plan.id} value={plan.id}>
                <RadioControl>
                  <RadioIndicator />
                  <FieldContent>
                    <Label>{plan.name}</Label>
                    <Description>{plan.text}</Description>
                  </FieldContent>
                </RadioControl>
              </Radio>
            ))}
          </div>
        </RadioGroup>
        <div className="grid gap-3 @lg:grid-cols-2">
          <Checkbox defaultSelected>
            <CheckboxControl className="self-stretch">
              <CheckboxIndicator />
              <FieldContent>
                <Label>Email receipts</Label>
                <Description>Sent to billing@acme.com</Description>
              </FieldContent>
            </CheckboxControl>
          </Checkbox>
          <Switch defaultSelected>
            <SwitchControl className="self-stretch">
              <FieldContent>
                <Label>Auto-renew</Label>
                <Description>Renews on November 1</Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
        </div>
      </div>
    </BoardSection>
  )
}

const REPLAY_MS = 1400

/** Live controls that flip on their own while the panel edits Selection's motion. */
function MotionSection() {
  const { axis } = useBoardFocus()
  const playing = axis === "selectionMotion"
  const [on, setOn] = useState(true)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setOn((value) => !value), REPLAY_MS)
    return () => clearInterval(timer)
  }, [playing])

  return (
    <BoardSection
      member="checkbox"
      title="Motion"
      axes={["selectionMotion"]}
      className="gap-x-10 gap-y-6"
    >
      <Checkbox isSelected={on} onChange={setOn}>
        Sync
      </Checkbox>
      <RadioGroup
        aria-label="View"
        value={on ? "grid" : "list"}
        onChange={(value) => setOn(value === "grid")}
        orientation="horizontal"
        className="flex-row gap-4"
      >
        <Radio value="list">List</Radio>
        <Radio value="grid">Grid</Radio>
      </RadioGroup>
      <Switch isSelected={on} onChange={setOn}>
        Live
      </Switch>
      <Slider
        aria-label="Zoom"
        value={on ? 80 : 20}
        onChange={(value) => setOn(Number(value) >= 50)}
        className="w-36"
      >
        <SliderControl />
      </Slider>
    </BoardSection>
  )
}

export default function SelectionBoard() {
  return (
    <Board id="selection">
      <CheckboxSection />
      <MotionSection />
      <RadioSection />
      <SwitchSection />
      <SliderSection />
      <ChoiceCardsSection />
    </Board>
  )
}

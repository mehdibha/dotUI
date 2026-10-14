"use client"

import { Description, FieldContent, Label } from "@/registry/ui/field"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { useStyles } from "@/registry/ui/switch/styles"

import {
  Board,
  BoardSection,
  CAPTION,
  useBoardFocus,
  useReplay,
  useSteps,
} from "./board"
import { SELECTED, SPLIT, StateGrid } from "./selection-parts"
import type { Attrs } from "./selection-parts"

const ROWS = [
  { label: "Off", attrs: {} },
  { label: "On", attrs: SELECTED },
]

function FrozenSwitch(attrs: Attrs) {
  const { root, control, indicator, thumb } = useStyles()()
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

const SIZES = ["sm", "md", "lg"] as const

function Sizes() {
  return (
    <div
      inert
      className="grid grid-cols-[repeat(3,auto)] items-center justify-items-center gap-x-8 gap-y-3"
    >
      {SIZES.map((size) => (
        <div
          key={size}
          className="row-span-3 grid grid-rows-subgrid items-center justify-items-center"
        >
          <Switch aria-label="Off" size={size}>
            <SwitchControl />
          </Switch>
          <Switch aria-label="On" size={size} defaultSelected>
            <SwitchControl />
          </Switch>
          <span className={CAPTION}>{size}</span>
        </div>
      ))}
    </div>
  )
}

/** A wave: each switch turns on after the one before it, then off. */
function MotionLoop() {
  const motion = useReplay("switchMotion")
  const phase = useSteps(motion, 450) % 6
  if (!motion.running)
    return (
      <div className="flex items-center gap-4">
        {[0, 1, 2].map((i) => (
          <Switch key={i} aria-label={`Switch ${i + 1}`} defaultSelected={!i}>
            <SwitchControl />
          </Switch>
        ))}
      </div>
    )
  return (
    <div inert className="flex items-center gap-4">
      {[0, 1, 2].map((i) => (
        <Switch
          key={i}
          aria-label={`Switch ${i + 1}`}
          isSelected={phase > i && phase <= i + 3}
        >
          <SwitchControl />
        </Switch>
      ))}
    </div>
  )
}

const SETTINGS = [
  { label: "Wi-Fi", text: "Connected to Studio 5G", on: true },
  { label: "Bluetooth", text: "Visible as MacBook Pro", on: false },
  {
    label: "Airplane mode",
    text: "Managed by your organization",
    on: false,
    disabled: true,
  },
]

function Settings() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {SETTINGS.map(({ label, text, on, disabled }) => (
        <Switch
          key={label}
          defaultSelected={on}
          isDisabled={disabled}
          className="justify-between gap-6"
        >
          <FieldContent>
            <Label>{label}</Label>
            <Description>{text}</Description>
          </FieldContent>
          <SwitchControl />
        </Switch>
      ))}
    </div>
  )
}

export default function SwitchBoard() {
  const { axis } = useBoardFocus()
  return (
    <Board id="switch">
      <div className={SPLIT}>
        <BoardSection title="States">
          <StateGrid
            rows={ROWS}
            states={["rest", "pressed", "focus", "disabled", "invalid"]}
            lit={axis === "switchColor" ? ["On"] : undefined}
          >
            {(attrs) => <FrozenSwitch {...attrs} />}
          </StateGrid>
        </BoardSection>
        <BoardSection title="Motion">
          <MotionLoop />
        </BoardSection>
        <BoardSection title="Group">
          <Settings />
        </BoardSection>
        <BoardSection title="Sizes">
          <Sizes />
        </BoardSection>
      </div>
    </Board>
  )
}

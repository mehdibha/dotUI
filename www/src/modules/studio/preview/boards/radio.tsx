"use client"

import { Description, FieldContent, Label } from "@/registry/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import { useStyles } from "@/registry/ui/radio-group/styles"

import {
  Board,
  BoardSection,
  useBoardFocus,
  useDriven,
  useReplay,
  useSteps,
} from "./board"
import { MAGNIFY, SELECTED, SPLIT, StateGrid } from "./selection-parts"
import type { Attrs } from "./selection-parts"

const ROWS = [
  { label: "Off", attrs: {} },
  { label: "On", attrs: SELECTED },
]

const LIT: Record<string, string[]> = {
  radioMark: ["On"],
  radioColor: ["On"],
}

function FrozenRadio(attrs: Attrs) {
  const { root, control, indicator } = useStyles()()
  return (
    <span data-radio="" className={root({ className: MAGNIFY })}>
      <span {...attrs} className={control()}>
        <span {...attrs} className={indicator()}>
          <span />
        </span>
      </span>
    </span>
  )
}

const VIEWS = ["list", "grid", "board"]

/** The selection walking down the options. */
function MotionLoop() {
  const motion = useReplay("checkboxMotion")
  const step = useSteps(motion, 1100)
  const [value, setValue] = useDriven(
    motion.running,
    VIEWS[step % VIEWS.length] ?? "list",
    "list",
  )
  return (
    <RadioGroup
      inert={motion.running}
      aria-label="View"
      value={value}
      onChange={setValue}
    >
      <Radio value="list">List</Radio>
      <Radio value="grid">Grid</Radio>
      <Radio value="board">Board</Radio>
    </RadioGroup>
  )
}

const CYCLES = [
  { id: "monthly", label: "Monthly", text: "$24 billed every month" },
  { id: "yearly", label: "Yearly", text: "$230 billed once, save 20%" },
  { id: "lifetime", label: "Lifetime", text: "Sold out for now" },
]

function Row({
  label,
  options,
  value,
}: {
  label: string
  options: string[]
  value: string
}) {
  return (
    <RadioGroup defaultValue={value}>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {options.map((option) => (
          <Radio key={option} value={option}>
            {option}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  )
}

function Groups() {
  return (
    <div className="grid gap-x-20 gap-y-8 sm:grid-cols-[auto_auto]">
      <RadioGroup defaultValue="yearly">
        <Label>Billing cycle</Label>
        {CYCLES.map(({ id, label, text }) => (
          <Radio key={id} value={id} isDisabled={id === "lifetime"}>
            <RadioControl />
            <FieldContent>
              <Label>{label}</Label>
              <Description>{text}</Description>
            </FieldContent>
          </Radio>
        ))}
      </RadioGroup>
      <div className="flex flex-col gap-8">
        <Row
          label="Theme"
          options={["Light", "Dark", "System"]}
          value="System"
        />
        <Row
          label="Week starts on"
          options={["Sunday", "Monday"]}
          value="Monday"
        />
      </div>
    </div>
  )
}

export default function RadioBoard() {
  const { axis } = useBoardFocus()
  return (
    <Board id="radio">
      <div className={SPLIT}>
        <BoardSection title="States">
          <StateGrid
            rows={ROWS}
            states={["rest", "focus", "disabled", "invalid"]}
            lit={axis ? LIT[axis] : undefined}
          >
            {(attrs) => <FrozenRadio {...attrs} />}
          </StateGrid>
        </BoardSection>
        <BoardSection title="Motion">
          <MotionLoop />
        </BoardSection>
      </div>
      <BoardSection title="Group">
        <Groups />
      </BoardSection>
    </Board>
  )
}

"use client"

import { CheckIcon, MinusIcon } from "@/registry/icons"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import { useStyles } from "@/registry/ui/checkbox/styles"
import { Description, FieldContent, Label } from "@/registry/ui/field"

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
  { label: "Mixed", attrs: { "data-indeterminate": "true" } },
]

const LIT: Record<string, string[]> = {
  checkEdge: ["Off"],
  checkboxColor: ["On", "Mixed"],
}

function FrozenCheckbox(attrs: Attrs) {
  const { root, control, indicator } = useStyles()()
  return (
    <span data-checkbox="" className={root({ className: MAGNIFY })}>
      <span {...attrs} className={control()}>
        <span {...attrs} className={indicator()}>
          {attrs["data-indeterminate"] ? <MinusIcon /> : <CheckIcon />}
        </span>
      </span>
    </span>
  )
}

// None, one, both, the other: the parent passes through mixed both ways.
const CYCLE = [[], ["photos"], ["photos", "documents"], ["documents"]]

function MotionLoop() {
  const motion = useReplay("checkboxMotion")
  const step = useSteps(motion, 1100)
  const [value, setValue] = useDriven(
    motion.running,
    CYCLE[step % CYCLE.length] ?? [],
    ["photos"],
  )
  return (
    <div inert={motion.running} className="flex flex-col gap-3">
      <Checkbox
        isSelected={value.length === 2}
        isIndeterminate={value.length === 1}
        onChange={(on) => setValue(on ? ["photos", "documents"] : [])}
      >
        All files
      </Checkbox>
      <CheckboxGroup
        aria-label="Files"
        value={value}
        onChange={setValue}
        className="ps-6"
      >
        <Checkbox value="photos">Photos</Checkbox>
        <Checkbox value="documents">Documents</Checkbox>
      </CheckboxGroup>
    </div>
  )
}

const TOPICS = [
  { id: "mentions", label: "Mentions", text: "When someone tags you" },
  { id: "digest", label: "Weekly digest", text: "A summary every Monday" },
  { id: "billing", label: "Billing", text: "Managed by your admin" },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]

function Groups() {
  return (
    <div className="grid gap-x-20 gap-y-8 sm:grid-cols-[auto_auto]">
      <CheckboxGroup defaultValue={["mentions", "billing"]}>
        <Label>Email me about</Label>
        {TOPICS.map(({ id, label, text }) => (
          <Checkbox key={id} value={id} isDisabled={id === "billing"}>
            <CheckboxControl />
            <FieldContent>
              <Label>{label}</Label>
              <Description>{text}</Description>
            </FieldContent>
          </Checkbox>
        ))}
      </CheckboxGroup>
      <div className="flex flex-col gap-8">
        <CheckboxGroup defaultValue={["mon", "wed", "fri"]}>
          <Label>Repeat on</Label>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {DAYS.map((day) => (
              <Checkbox key={day} value={day.toLowerCase()}>
                {day}
              </Checkbox>
            ))}
          </div>
        </CheckboxGroup>
        <Checkbox defaultSelected>
          <CheckboxControl />
          <FieldContent>
            <Label>Skip public holidays</Label>
            <Description>Moves it to the next workday</Description>
          </FieldContent>
        </Checkbox>
      </div>
    </div>
  )
}

export default function CheckboxBoard() {
  const { axis } = useBoardFocus()
  return (
    <Board id="checkbox">
      <div className={SPLIT}>
        <BoardSection title="States">
          <StateGrid
            rows={ROWS}
            states={["rest", "focus", "disabled", "invalid"]}
            lit={axis ? LIT[axis] : undefined}
          >
            {(attrs) => <FrozenCheckbox {...attrs} />}
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

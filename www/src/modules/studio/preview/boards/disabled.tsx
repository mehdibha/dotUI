"use client"

import { Button } from "@/registry/ui/button"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Slider, SliderControl } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"

import { Board, useBoardFocus } from "./board"
import { CANVAS, ComponentSet, SetGrid } from "./set-parts"

/* Disabled is a prop, so each set renders the real components, enabled
   above and disabled below. Selected and checked parts stay so in both
   rows: they are where a disabled look most often slips. */

type Row = { disabled: boolean }

function Buttons({ disabled }: Row) {
  return (
    <>
      <Button variant="primary" isDisabled={disabled}>
        Publish
      </Button>
      <Button isDisabled={disabled}>Preview</Button>
      <Button variant="danger" isDisabled={disabled}>
        Delete
      </Button>
      <ToggleButton defaultSelected isDisabled={disabled}>
        Pinned
      </ToggleButton>
    </>
  )
}

function SelectionControls({ disabled }: Row) {
  return (
    <>
      <Checkbox defaultSelected isDisabled={disabled}>
        <CheckboxControl />
        <Label>Remember me</Label>
      </Checkbox>
      <RadioGroup
        aria-label="Billing"
        defaultValue="monthly"
        isDisabled={disabled}
      >
        <Radio value="monthly">
          <RadioControl />
          <Label>Monthly</Label>
        </Radio>
      </RadioGroup>
      <Switch aria-label="Notifications" defaultSelected isDisabled={disabled}>
        <SwitchControl />
      </Switch>
      <Switch aria-label="Sync" isDisabled={disabled}>
        <SwitchControl />
      </Switch>
    </>
  )
}

function Navigation({ disabled }: Row) {
  return (
    <>
      <Tabs isDisabled={disabled}>
        <TabList aria-label="Sections">
          <Tab id="overview">Overview</Tab>
          <Tab id="activity">Activity</Tab>
        </TabList>
      </Tabs>
      <SegmentedControl
        aria-label="Range"
        defaultSelectedKeys={["week"]}
        isDisabled={disabled}
      >
        <SegmentedControlItem id="day">Day</SegmentedControlItem>
        <SegmentedControlItem id="week">Week</SegmentedControlItem>
      </SegmentedControl>
    </>
  )
}

function Inputs({ disabled }: Row) {
  return (
    <>
      <TextField
        aria-label="Full name"
        defaultValue="Ada Lovelace"
        isDisabled={disabled}
        className="w-44"
      >
        <Input />
      </TextField>
      <Slider
        aria-label="Volume"
        defaultValue={60}
        isDisabled={disabled}
        className="w-44"
      >
        <SliderControl />
      </Slider>
    </>
  )
}

const SETS = [
  { name: "Buttons", Set: Buttons },
  { name: "Selection", Set: SelectionControls },
  { name: "Navigation", Set: Navigation },
  { name: "Inputs", Set: Inputs },
]

export default function DisabledBoard() {
  const { axis, holds } = useBoardFocus()
  // One setting dresses every set.
  const selected = [axis, ...(holds ?? [])].includes("disabledTreatment")
  return (
    <Board id="disabled" untitled className={CANVAS}>
      <SetGrid>
        {SETS.map(({ name, Set }) => (
          <ComponentSet
            key={name}
            name={name}
            selected={selected}
            rows={[false, true].map((disabled) => (
              <Set key={String(disabled)} disabled={disabled} />
            ))}
          />
        ))}
      </SetGrid>
    </Board>
  )
}

"use client"

import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/registry/ui/checkbox"
import { Description, FieldContent, Label } from "@/registry/ui/field"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import { useStyles } from "@/registry/ui/radio-group/styles"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"

import { Board, BoardSection, useBoardFocus } from "./board"
import { SELECTED, StateGrid } from "./selection-parts"
import type { Attrs } from "./selection-parts"

const ROWS = [
  { label: "Off", attrs: {} },
  { label: "On", attrs: SELECTED },
]

const LIT: Record<string, string[]> = {
  cardSelected: ["On"],
  cardColor: ["On"],
}

/** A radio card on plain markup, so focus can be frozen. */
function FrozenCard(attrs: Attrs) {
  const { root, control, indicator } = useStyles()()
  return (
    <span data-radio="" className={root({ className: "w-full" })}>
      <span {...attrs} className={control()}>
        <span {...attrs} data-radio-indicator="" className={indicator()}>
          <span />
        </span>
        <FieldContent>
          <Label elementType="span">Pro</Label>
          <Description className="max-sm:hidden">$20 a month</Description>
        </FieldContent>
      </span>
    </span>
  )
}

function Card({
  title,
  text,
  control,
}: {
  title: string
  text: string
  control: React.ReactNode
}) {
  return (
    <>
      {control}
      <FieldContent>
        <Label>{title}</Label>
        <Description>{text}</Description>
      </FieldContent>
    </>
  )
}

// Rows shared across the columns, so a switch's taller row sets every card's.
const COLUMN = "grid gap-3 md:row-span-2 md:grid-rows-subgrid"
const FILL = "has-data-description:items-stretch"

function Controls() {
  return (
    <div className="grid w-full gap-x-6 gap-y-8 md:grid-cols-3 md:gap-y-3">
      <RadioGroup defaultValue="pro" aria-label="Plan" className={COLUMN}>
        {[
          { id: "hobby", title: "Hobby", text: "Free for side projects" },
          { id: "pro", title: "Pro", text: "$20 a month per seat" },
        ].map(({ id, title, text }) => (
          <Radio key={id} value={id} className={FILL}>
            <RadioControl>
              <Card title={title} text={text} control={<RadioIndicator />} />
            </RadioControl>
          </Radio>
        ))}
      </RadioGroup>
      <div className={COLUMN}>
        <Checkbox defaultSelected className={FILL}>
          <CheckboxControl>
            <Card
              title="Email receipts"
              text="Sent to billing@acme.com"
              control={<CheckboxIndicator />}
            />
          </CheckboxControl>
        </Checkbox>
        <Checkbox className={FILL}>
          <CheckboxControl>
            <Card
              title="Text alerts"
              text="Only for failed payments"
              control={<CheckboxIndicator />}
            />
          </CheckboxControl>
        </Checkbox>
      </div>
      <div className={COLUMN}>
        <Switch defaultSelected className={FILL}>
          <SwitchControl>
            <FieldContent>
              <Label>Auto-renew</Label>
              <Description>Renews on November 1</Description>
            </FieldContent>
            <SwitchIndicator />
          </SwitchControl>
        </Switch>
        <Switch className={FILL}>
          <SwitchControl>
            <FieldContent>
              <Label>Usage alerts</Label>
              <Description>At 80% of your quota</Description>
            </FieldContent>
            <SwitchIndicator />
          </SwitchControl>
        </Switch>
      </div>
    </div>
  )
}

export default function ChoiceCardBoard() {
  const { axis } = useBoardFocus()
  return (
    <Board id="choice-card">
      <BoardSection title="States">
        <StateGrid
          rows={ROWS}
          states={["rest", "focus", "disabled"]}
          lit={axis ? LIT[axis] : undefined}
          column="minmax(0,14rem)"
          className="w-full"
        >
          {(attrs) => <FrozenCard {...attrs} />}
        </StateGrid>
      </BoardSection>
      <BoardSection title="Variants">
        <Controls />
      </BoardSection>
    </Board>
  )
}

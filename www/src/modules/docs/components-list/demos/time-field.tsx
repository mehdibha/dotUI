'use client'

import { Time } from '@internationalized/date'

import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

import { DemoFocus, useCardHover } from '../autoplay'

// Shows a real time and lights up its real focus ring while the card is hovered.
// We only set `data-focused` on the field (no real `:focus`), so it never steals
// the page's focus.
export function TimeFieldDemo() {
  const active = useCardHover()
  return (
    <TimeField defaultValue={new Time(11, 45)}>
      <Label>Event time</Label>
      <DemoFocus active={active}>
        <DateInput className="w-40" />
      </DemoFocus>
    </TimeField>
  )
}

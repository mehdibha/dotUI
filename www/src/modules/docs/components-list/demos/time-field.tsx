'use client'

import { Time } from '@internationalized/date'

import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

import { demoFocusProps, useCardHover } from '../autoplay'

// The field shows a real time and lights up its focus ring whenever the card is
// hovered — a faux ring (no real `:focus`), so it never steals page focus.
export function TimeFieldDemo() {
  const active = useCardHover()
  return (
    <TimeField defaultValue={new Time(11, 45)}>
      <Label>Event time</Label>
      <DateInput className="w-40" {...demoFocusProps(active)} />
    </TimeField>
  )
}

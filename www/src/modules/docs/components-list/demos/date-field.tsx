'use client'

import { parseDate } from '@internationalized/date'

import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

import { demoFocusProps, useCardHover } from '../autoplay'

// The field shows a real date and lights up its focus ring whenever the card is
// hovered — a faux ring (no real `:focus`), so it never steals page focus.
export function DateFieldDemo() {
  const active = useCardHover()
  return (
    <DateField defaultValue={parseDate('2024-06-12')}>
      <Label>Meeting date</Label>
      <DateInput className="w-40" {...demoFocusProps(active)} />
    </DateField>
  )
}

'use client'

import { parseDate } from '@internationalized/date'

import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

import { DemoFocus, useCardHover } from '../autoplay'

// Shows a real date and lights up its real focus ring while the card is hovered.
// We only set `data-focused` on the field (no real `:focus`), so it never steals
// the page's focus.
export function DateFieldDemo() {
  const active = useCardHover()
  return (
    <DateField defaultValue={parseDate('2024-06-12')}>
      <Label>Meeting date</Label>
      <DemoFocus active={active}>
        <DateInput className="w-40" />
      </DemoFocus>
    </DateField>
  )
}

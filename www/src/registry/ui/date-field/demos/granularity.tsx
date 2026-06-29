'use client'

import { parseAbsoluteToLocal } from '@internationalized/date'

import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <DateField
        granularity="hour"
        defaultValue={parseAbsoluteToLocal('2021-04-07T18:45:22Z')}
      >
        <Label>Hour</Label>
        <DateInput />
      </DateField>
      <DateField
        granularity="minute"
        defaultValue={parseAbsoluteToLocal('2021-04-07T18:45:22Z')}
      >
        <Label>Minute</Label>
        <DateInput />
      </DateField>
      <DateField
        granularity="second"
        defaultValue={parseAbsoluteToLocal('2021-04-07T18:45:22Z')}
      >
        <Label>Second</Label>
        <DateInput />
      </DateField>
    </div>
  )
}

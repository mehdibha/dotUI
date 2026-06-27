'use client'

import { FieldGroup, Label } from '@/registry/ui/field'
import { Radio, RadioControl, RadioGroup } from '@/registry/ui/radio-group'

import { useStepAutoplay } from '../autoplay'

const KEYS = ['nextjs', 'remix', 'gatsby']

export function RadioGroupDemo() {
  const { index } = useStepAutoplay(KEYS.length, { dwell: 1300 })
  return (
    <RadioGroup value={KEYS[index]} onChange={() => {}}>
      <Label>React frameworks</Label>
      <FieldGroup>
        <Radio value="nextjs">
          <RadioControl />
          <Label>Next.js</Label>
        </Radio>
        <Radio value="remix">
          <RadioControl />
          <Label>Remix</Label>
        </Radio>
        <Radio value="gatsby">
          <RadioControl />
          <Label>Gatsby</Label>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  )
}

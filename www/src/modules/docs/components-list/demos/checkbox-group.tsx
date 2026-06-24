'use client'

import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { CheckboxGroup } from '@/registry/ui/checkbox-group'
import { FieldGroup, Label } from '@/registry/ui/field'

import { useStepAutoplay } from '../autoplay'

const KEYS = ['nextjs', 'remix', 'astro']

export function CheckboxGroupDemo() {
  const { index } = useStepAutoplay(KEYS.length, { dwell: 1300 })
  return (
    <CheckboxGroup value={[KEYS[index]]} onChange={() => {}}>
      <Label>React frameworks</Label>
      <FieldGroup>
        <Checkbox value="nextjs">
          <CheckboxControl />
          <Label>Next.js</Label>
        </Checkbox>
        <Checkbox value="remix">
          <CheckboxControl />
          <Label>Remix</Label>
        </Checkbox>
        <Checkbox value="astro">
          <CheckboxControl />
          <Label>Astro</Label>
        </Checkbox>
      </FieldGroup>
    </CheckboxGroup>
  )
}

'use client'

import { Button } from '@/registry/ui/button'
import { Field, Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'

export default function Demo() {
  return (
    <Field>
      <Label id="alignment-label">Text Alignment</Label>
      <Group aria-labelledby="alignment-label">
        <Button size="sm">Left</Button>
        <Button size="sm">Center</Button>
        <Button size="sm">Right</Button>
        <Button size="sm">Justify</Button>
      </Group>
    </Field>
  )
}

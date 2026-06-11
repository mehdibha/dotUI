'use client'

import { FieldError, Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <TextField isInvalid>
      <Label>Comment</Label>
      <TextArea />
      <FieldError>You have exceeded the comment limit for one hour.</FieldError>
    </TextField>
  )
}

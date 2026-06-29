'use client'

import { useState } from 'react'

import { Button } from '@/registry/ui/button'
import { Description, FieldError, Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

const MAX_LENGTH = 240

export default function Demo() {
  const [feedback, setFeedback] = useState('')
  const isTooLong = feedback.length > MAX_LENGTH

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <TextField
        value={feedback}
        onChange={setFeedback}
        isInvalid={isTooLong}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <Label>Your feedback</Label>
          <span className="text-xs text-fg-muted tabular-nums">
            {feedback.length}/{MAX_LENGTH}
          </span>
        </div>
        <TextArea placeholder="Tell us what you think…" rows={4} />
        {isTooLong ? (
          <FieldError>Please keep it under {MAX_LENGTH} characters.</FieldError>
        ) : (
          <Description>Share what we could improve.</Description>
        )}
      </TextField>
      <Button type="submit" isDisabled={isTooLong || feedback.length === 0}>
        Send feedback
      </Button>
    </form>
  )
}

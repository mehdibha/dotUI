'use client'

import { useState } from 'react'

import { Button } from '@/registry/ui/button'
import { Description, FieldError, Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

const MIN_LENGTH = 20

export default function Demo() {
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isTooShort = description.trim().length < MIN_LENGTH

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
    >
      <TextField
        value={description}
        onChange={(value) => {
          setDescription(value)
          setSubmitted(false)
        }}
        isInvalid={submitted && isTooShort}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <Label>Describe the issue</Label>
          <span className="text-xs text-fg-muted tabular-nums">
            {description.length}
          </span>
        </div>
        <TextArea
          placeholder="Steps to reproduce, expected vs. actual behavior…"
          rows={5}
        />
        {submitted && isTooShort ? (
          <FieldError>
            Add at least {MIN_LENGTH} characters so we can investigate.
          </FieldError>
        ) : (
          <Description>
            Include steps to reproduce and what you expected.
          </Description>
        )}
      </TextField>
      <Button type="submit">Submit report</Button>
    </form>
  )
}

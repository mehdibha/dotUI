'use client'

import React from 'react'

import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  const [inputValue, setInputValue] = React.useState('Hello world!')
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <TextField
        aria-label="Controlled text field"
        value={inputValue}
        onChange={setInputValue}
      >
        <Input />
      </TextField>
      <p className="text-sm text-fg-muted">mirrored text: {inputValue}</p>
    </div>
  )
}

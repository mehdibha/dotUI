'use client'

import type React from 'react'
import * as FormPrimitives from 'react-aria-components/Form'

import { Button } from '@/registry/ui/button'
import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <FormPrimitives.Form onSubmit={handleSubmit} className="w-xs space-y-4">
      <TextField isRequired>
        <Label>Name</Label>
        <Input name="name" minLength={2} placeholder="Name" />
        <Description>Please enter your full name.</Description>
      </TextField>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </FormPrimitives.Form>
  )
}

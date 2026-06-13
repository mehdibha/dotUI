'use client'

import type React from 'react'

import { Button } from '@/registry/ui/button'
import { Description, FieldError, Label } from '@/registry/ui/field'
import { Form } from '@/registry/ui/form'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <Form onSubmit={handleSubmit} className="w-xs">
      <TextField name="name" isRequired>
        <Label>Name</Label>
        <Input minLength={2} placeholder="Your name" />
        <Description>Please enter your full name.</Description>
        <FieldError />
      </TextField>
      <Button type="submit" variant="primary" className="w-fit">
        Submit
      </Button>
    </Form>
  )
}

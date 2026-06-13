'use client'

import type React from 'react'

import { Button } from '@/registry/ui/button'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { FieldError, FieldGroup, Label } from '@/registry/ui/field'
import { Form } from '@/registry/ui/form'
import { Input } from '@/registry/ui/input'
import { Radio, RadioControl, RadioGroup } from '@/registry/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div className="w-sm rounded-lg border bg-muted p-8">
      <h1 className="text-xl font-bold">Register</h1>
      <Form onSubmit={handleSubmit} className="mt-4">
        <TextField name="name" isRequired>
          <Label>Name</Label>
          <Input minLength={2} placeholder="Name" />
          <FieldError />
        </TextField>
        <TextField name="email" type="email" isRequired>
          <Label>Email</Label>
          <Input placeholder="Email" />
          <FieldError />
        </TextField>
        <RadioGroup name="gender" isRequired orientation="horizontal">
          <Label>Gender</Label>
          <FieldGroup>
            <Radio value="male">
              <RadioControl />
              <Label>Male</Label>
            </Radio>
            <Radio value="female">
              <RadioControl />
              <Label>Female</Label>
            </Radio>
            <Radio value="other">
              <RadioControl />
              <Label>Other</Label>
            </Radio>
          </FieldGroup>
          <FieldError />
        </RadioGroup>
        <Select name="referral" isRequired>
          <Label>How did you hear about us?</Label>
          <SelectTrigger variant="default" className="w-full" />
          <FieldError />
          <SelectContent>
            <SelectItem id="linkedin">LinkedIn</SelectItem>
            <SelectItem id="x">X</SelectItem>
          </SelectContent>
        </Select>
        <Checkbox name="terms" isRequired>
          <CheckboxControl />
          <Label>I agree to the terms and conditions</Label>
        </Checkbox>
        <div className="flex justify-end gap-2">
          <Button type="reset" variant="quiet">
            Reset
          </Button>
          <Button type="submit">Register</Button>
        </div>
      </Form>
    </div>
  )
}

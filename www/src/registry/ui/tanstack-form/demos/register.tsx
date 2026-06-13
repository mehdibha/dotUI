'use client'

import { z } from 'zod'

import { CheckboxControl } from '@/registry/ui/checkbox'
import { FieldGroup, Label } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/registry/ui/number-field'
import { Radio, RadioControl } from '@/registry/ui/radio-group'
import { SelectContent, SelectItem, SelectTrigger } from '@/registry/ui/select'
import { SwitchControl } from '@/registry/ui/switch'
import { useAppForm } from '@/registry/ui/tanstack-form'

const FormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
  age: z.number().min(18, 'You must be at least 18.'),
  gender: z.enum(['male', 'female', 'other'], 'Please select a gender.'),
  referral: z.string().min(1, 'Please select a method.'),
  notifications: z.boolean(),
  terms: z
    .boolean()
    .refine((val) => val, 'You must accept the terms and conditions.'),
})

export default function Demo() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      age: 18,
      gender: '',
      referral: '',
      notifications: true,
      terms: false,
    },
    validators: { onChange: FormSchema },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <div className="w-sm rounded-lg border bg-muted p-8">
      <h1 className="text-xl font-bold">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="mt-4 flex flex-col gap-4"
      >
        <form.AppField name="name">
          {(field) => (
            <field.TextField>
              <Label>Name</Label>
              <Input placeholder="Name" />
            </field.TextField>
          )}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextField>
              <Label>Email</Label>
              <Input placeholder="Email" />
            </field.TextField>
          )}
        </form.AppField>
        <form.AppField name="age">
          {(field) => (
            <field.NumberField minValue={0}>
              <Label>Age</Label>
              <Group>
                <NumberFieldDecrement />
                <Input />
                <NumberFieldIncrement />
              </Group>
            </field.NumberField>
          )}
        </form.AppField>
        <form.AppField name="gender">
          {(field) => (
            <field.RadioGroup orientation="horizontal">
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
            </field.RadioGroup>
          )}
        </form.AppField>
        <form.AppField name="referral">
          {(field) => (
            <field.Select className="w-full">
              <Label>How did you hear about us?</Label>
              <SelectTrigger variant="default" className="w-full" />
              <SelectContent>
                <SelectItem id="linkedin">LinkedIn</SelectItem>
                <SelectItem id="x">X</SelectItem>
              </SelectContent>
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="notifications">
          {(field) => (
            <field.Switch>
              <SwitchControl />
              <Label>Email me product updates</Label>
            </field.Switch>
          )}
        </form.AppField>
        <form.AppField name="terms">
          {(field) => (
            <div className="flex flex-col gap-1">
              <field.Checkbox>
                <CheckboxControl />
                <Label>I agree to the terms and conditions</Label>
              </field.Checkbox>
              {field.state.meta.errors[0] && (
                <span className="text-sm text-fg-danger">
                  {field.state.meta.errors[0].message}
                </span>
              )}
            </div>
          )}
        </form.AppField>
        <form.AppForm>
          <div className="flex justify-end gap-2">
            <form.ResetButton variant="quiet">Reset</form.ResetButton>
            <form.SubmitButton>Register</form.SubmitButton>
          </div>
        </form.AppForm>
      </form>
    </div>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CalendarIcon, ChevronDownIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Calendar } from '@/registry/ui/calendar'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Combobox } from '@/registry/ui/combobox'
import { DatePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { FieldError, FieldGroup, Label } from '@/registry/ui/field'
import {
  DateInput,
  Input,
  InputGroup,
  InputGroupAddon,
} from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Radio, RadioControl, RadioGroup } from '@/registry/ui/radio-group'
import { FormControl } from '@/registry/ui/react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { TextField } from '@/registry/ui/text-field'

const FormSchema = z.object({
  name: z
    .string('Name is required.')
    .min(2, 'Name must be at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
  gender: z.enum(['male', 'female', 'other'], 'Please select a gender.'),
  'birth-date': z.string('Please pick your birth date.'),
  language: z.string('Please select a language.'),
  referral: z.string('Please select a method.'),
  terms: z
    .boolean()
    .refine((val) => val, 'You must accept the terms and conditions.'),
})

type FormValues = z.infer<typeof FormSchema>

export default function Demo() {
  const { handleSubmit, control } = useForm<FormValues>({
    // oxlint-disable-next-line typescript/no-explicit-any -- zodResolver's overloads lag this bundled Zod v4 build.
    resolver: zodResolver(FormSchema as any),
    defaultValues: { terms: false },
  })

  return (
    <div className="w-sm rounded-lg border bg-muted p-8">
      <h1 className="text-xl font-bold">Register</h1>
      <form
        onSubmit={handleSubmit((data) => {
          alert(JSON.stringify(data, null, 2))
        })}
        className="mt-4 flex flex-col gap-4"
      >
        <FormControl
          name="name"
          control={control}
          render={({ errorMessage, ...props }) => (
            <TextField {...props}>
              <Label>Name</Label>
              <Input placeholder="Name" />
              <FieldError>{errorMessage}</FieldError>
            </TextField>
          )}
        />
        <FormControl
          name="email"
          control={control}
          render={({ errorMessage, ...props }) => (
            <TextField {...props}>
              <Label>Email</Label>
              <Input placeholder="Email" />
              <FieldError>{errorMessage}</FieldError>
            </TextField>
          )}
        />
        <FormControl
          name="gender"
          control={control}
          render={({ value, errorMessage, ...props }) => (
            <RadioGroup
              orientation="horizontal"
              value={value ?? null}
              {...props}
            >
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
              <FieldError>{errorMessage}</FieldError>
            </RadioGroup>
          )}
        />
        <FormControl
          name="birth-date"
          control={control}
          render={({ value, onChange, errorMessage, ...props }) => (
            <DatePicker
              value={value ? parseDate(value) : null}
              onChange={(date) => onChange(date?.toString() ?? '')}
              className="w-full"
              {...props}
            >
              <Label>Birth date</Label>
              <InputGroup>
                <DateInput />
                <InputGroupAddon>
                  <Button variant="default" size="sm" isIconOnly>
                    <CalendarIcon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{errorMessage}</FieldError>
              <Popover>
                <DialogContent>
                  <Calendar />
                </DialogContent>
              </Popover>
            </DatePicker>
          )}
        />
        <FormControl
          name="language"
          control={control}
          render={({ value, onChange, errorMessage, ...props }) => (
            <Combobox
              selectedKey={value ?? null}
              onSelectionChange={(key) => onChange(key)}
              className="w-full"
              {...props}
            >
              <Label>Preferred language</Label>
              <InputGroup>
                <Input />
                <InputGroupAddon>
                  <Button variant="quiet" isIconOnly>
                    <ChevronDownIcon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{errorMessage}</FieldError>
              <Popover>
                <ListBox items={languages}>
                  {(item) => (
                    <ListBoxItem key={item.value} id={item.value}>
                      {item.label}
                    </ListBoxItem>
                  )}
                </ListBox>
              </Popover>
            </Combobox>
          )}
        />
        <FormControl
          name="referral"
          control={control}
          render={({ value, onChange, errorMessage, ...props }) => (
            <Select
              selectedKey={value ?? null}
              onSelectionChange={(key) => onChange(key)}
              className="w-full"
              {...props}
            >
              <Label>How did you hear about us?</Label>
              <SelectTrigger variant="default" className="w-full" />
              <FieldError>{errorMessage}</FieldError>
              <SelectContent>
                <SelectItem id="linkedin">LinkedIn</SelectItem>
                <SelectItem id="x">X</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FormControl
          name="terms"
          control={control}
          render={({ value, onChange, errorMessage, isInvalid, ...props }) => (
            <Checkbox
              isSelected={Boolean(value)}
              onChange={onChange}
              isInvalid={isInvalid}
              {...props}
            >
              <CheckboxControl />
              <Label>I agree to the terms and conditions</Label>
              {isInvalid && (
                <span className="w-full text-sm text-fg-danger">
                  {errorMessage}
                </span>
              )}
            </Checkbox>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Register</Button>
        </div>
      </form>
    </div>
  )
}

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

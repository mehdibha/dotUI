'use client'

import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from '@tanstack/react-form'
import type * as CalendarPrimitives from 'react-aria-components/Calendar'
import type * as ColorAreaPrimitives from 'react-aria-components/ColorArea'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import type * as MenuPrimitives from 'react-aria-components/Menu'
import type * as TimeFieldPrimitives from 'react-aria-components/TimeField'

import { Button } from '@/registry/ui/button'
import type { ButtonProps } from '@/registry/ui/button'
import { Checkbox } from '@/registry/ui/checkbox'
import type { CheckboxProps } from '@/registry/ui/checkbox'
import { ColorField } from '@/registry/ui/color-field'
import type { ColorFieldProps } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import type { ColorPickerProps } from '@/registry/ui/color-picker'
import { Combobox } from '@/registry/ui/combobox'
import type { ComboboxProps } from '@/registry/ui/combobox'
import { DateField } from '@/registry/ui/date-field'
import type { DateFieldProps } from '@/registry/ui/date-field'
import { DatePicker } from '@/registry/ui/date-picker'
import type { DatePickerProps } from '@/registry/ui/date-picker'
import { FieldError } from '@/registry/ui/field'
import { NumberField } from '@/registry/ui/number-field'
import type { NumberFieldProps } from '@/registry/ui/number-field'
import { RadioGroup } from '@/registry/ui/radio-group'
import type { RadioGroupProps } from '@/registry/ui/radio-group'
import { SearchField } from '@/registry/ui/search-field'
import type { SearchFieldProps } from '@/registry/ui/search-field'
import { Select } from '@/registry/ui/select'
import type { SelectProps } from '@/registry/ui/select'
import { Slider } from '@/registry/ui/slider'
import type { SliderProps } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'
import type { SwitchProps } from '@/registry/ui/switch'
import { TextField } from '@/registry/ui/text-field'
import type { TextFieldProps } from '@/registry/ui/text-field'
import { TimeField } from '@/registry/ui/time-field'
import type { TimeFieldProps } from '@/registry/ui/time-field'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  formComponents: {
    SubmitButton: (props: ButtonProps) => {
      const form = useFormContext()
      const [isSubmitting, isDirty] = useStore(form.store, (state) => [
        state.isSubmitting,
        state.isDirty,
      ])

      return (
        <Button
          type="submit"
          variant="primary"
          isPending={isSubmitting}
          isDisabled={!isDirty}
          {...props}
        />
      )
    },
    ResetButton: (props: ButtonProps) => {
      const form = useFormContext()
      const isDirty = useStore(form.store, (state) => state.isDirty)

      return (
        <Button onPress={() => form.reset()} isDisabled={!isDirty} {...props} />
      )
    },
  },
  fieldComponents: {
    TextField: (props: TextFieldProps) => {
      const field = useFieldContext<string>()
      return (
        <TextField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </TextField>
      )
    },
    NumberField: (props: NumberFieldProps) => {
      const field = useFieldContext<number>()
      return (
        <NumberField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </NumberField>
      )
    },
    Checkbox: (props: CheckboxProps) => {
      const field = useFieldContext<boolean>()
      return (
        <Checkbox
          isSelected={Boolean(field.state.value)}
          onChange={(isSelected) => field.handleChange(isSelected)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      )
    },
    Switch: (props: SwitchProps) => {
      const field = useFieldContext<boolean>()
      return (
        <Switch
          isSelected={field.state.value}
          onChange={(isSelected) => field.handleChange(isSelected)}
          onBlur={field.handleBlur}
          {...props}
        />
      )
    },
    RadioGroup: (props: RadioGroupProps) => {
      const field = useFieldContext<string>()
      return (
        <RadioGroup
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </RadioGroup>
      )
    },
    Slider: (props: SliderProps) => {
      const field = useFieldContext<number | number[]>()
      return (
        <Slider
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onChangeEnd={() => field.handleBlur()}
          {...props}
        />
      )
    },
    Select: <T extends object>(props: SelectProps<T>) => {
      const field = useFieldContext<MenuPrimitives.Key | null>()
      return (
        <Select
          value={field.state.value}
          onChange={(key) => field.handleChange(key)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </Select>
      )
    },
    Combobox: <T extends object>(props: ComboboxProps<T>) => {
      const field = useFieldContext<MenuPrimitives.Key | null>()
      return (
        <Combobox
          selectedKey={field.state.value}
          onSelectionChange={(key) => field.handleChange(key)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </Combobox>
      )
    },
    SearchField: (props: SearchFieldProps) => {
      const field = useFieldContext<string>()
      return (
        <SearchField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </SearchField>
      )
    },
    DateField: (props: DateFieldProps<CalendarPrimitives.DateValue>) => {
      const field = useFieldContext<CalendarPrimitives.DateValue | null>()
      return (
        <DateField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </DateField>
      )
    },
    DatePicker: (props: DatePickerProps<CalendarPrimitives.DateValue>) => {
      const field = useFieldContext<CalendarPrimitives.DateValue | null>()
      return (
        <DatePicker
          value={undefined}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      )
    },
    TimeField: (props: TimeFieldProps<TimeFieldPrimitives.TimeValue>) => {
      const field = useFieldContext<TimeFieldPrimitives.TimeValue | null>()
      return (
        <TimeField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </TimeField>
      )
    },
    ColorField: (props: ColorFieldProps) => {
      const field = useFieldContext<ColorAreaPrimitives.Color | null>()
      return (
        <ColorField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {children}
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            </>
          ))}
        </ColorField>
      )
    },
    ColorPicker: (props: ColorPickerProps) => {
      const field = useFieldContext<string | ColorAreaPrimitives.Color>()
      return (
        <ColorPicker
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          {...props}
        />
      )
    },
  },
})

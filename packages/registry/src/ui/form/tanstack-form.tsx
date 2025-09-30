"use client";

import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";
import type { RangeValue } from "@react-types/shared";
import type { Color, DateValue, Key, TimeValue } from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { Checkbox } from "@dotui/registry/ui/checkbox";
import { ColorField } from "@dotui/registry/ui/color-field";
import { ColorPicker } from "@dotui/registry/ui/color-picker";
import { Combobox } from "@dotui/registry/ui/combobox";
import { DateField } from "@dotui/registry/ui/date-field";
import { DatePicker } from "@dotui/registry/ui/date-picker";
import { DateRangePicker } from "@dotui/registry/ui/date-range-picker";
import { NumberField } from "@dotui/registry/ui/number-field";
import { RadioGroup } from "@dotui/registry/ui/radio-group";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select } from "@dotui/registry/ui/select";
import { Slider } from "@dotui/registry/ui/slider";
import { Switch } from "@dotui/registry/ui/switch";
import { TextArea } from "@dotui/registry/ui/text-area";
import { TextField } from "@dotui/registry/ui/text-field";
import { TimeField } from "@dotui/registry/ui/time-field";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { CheckboxProps } from "@dotui/registry/ui/checkbox";
import type { ColorFieldProps } from "@dotui/registry/ui/color-field";
import type { ColorPickerProps } from "@dotui/registry/ui/color-picker";
import type { ComboboxProps } from "@dotui/registry/ui/combobox";
import type { DateFieldProps } from "@dotui/registry/ui/date-field";
import type { DatePickerProps } from "@dotui/registry/ui/date-picker";
import type { DateRangePickerProps } from "@dotui/registry/ui/date-range-picker";
import type { NumberFieldProps } from "@dotui/registry/ui/number-field";
import type { RadioGroupProps } from "@dotui/registry/ui/radio-group";
import type { SearchFieldProps } from "@dotui/registry/ui/search-field";
import type { SelectProps } from "@dotui/registry/ui/select";
import type { SliderProps } from "@dotui/registry/ui/slider";
import type { SwitchProps } from "@dotui/registry/ui/switch";
import type { TextAreaProps } from "@dotui/registry/ui/text-area";
import type { TextFieldProps } from "@dotui/registry/ui/text-field";
import type { TimeFieldProps } from "@dotui/registry/ui/time-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  formComponents: {
    SubmitButton: (props: ButtonProps) => {
      const form = useFormContext();
      const [isSubmitting, isDirty] = useStore(form.store, (state) => [
        state.isSubmitting,
        state.isDirty,
      ]);

      return (
        <Button
          type="submit"
          variant="primary"
          isPending={isSubmitting}
          isDisabled={!isDirty}
          {...props}
        />
      );
    },
    ResetButton: (props: ButtonProps) => {
      const form = useFormContext();
      const isDirty = useStore(form.store, (state) => state.isDirty);

      return (
        <Button onPress={() => form.reset()} isDisabled={!isDirty} {...props} />
      );
    },
  },
  fieldComponents: {
    TextField: (props: TextFieldProps) => {
      const field = useFieldContext<string>();
      return (
        <TextField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    TextArea: (props: TextAreaProps) => {
      const field = useFieldContext<string>();
      return (
        <TextArea
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    NumberField: (props: NumberFieldProps) => {
      const field = useFieldContext<number>();
      return (
        <NumberField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    Checkbox: (props: CheckboxProps) => {
      const field = useFieldContext<boolean>();
      return (
        <Checkbox
          isSelected={Boolean(field.state.value)}
          onChange={(isSelected) => field.handleChange(isSelected)}
          onBlur={field.handleBlur}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    Switch: (props: SwitchProps) => {
      const field = useFieldContext<boolean>();
      return (
        <Switch
          isSelected={field.state.value}
          onChange={(isSelected) => field.handleChange(isSelected)}
          onBlur={field.handleBlur}
          {...props}
        />
      );
    },
    RadioGroup: (props: RadioGroupProps) => {
      const field = useFieldContext<string>();
      return (
        <RadioGroup
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    Slider: (props: SliderProps) => {
      const field = useFieldContext<number | number[]>();
      return (
        <Slider
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onChangeEnd={() => field.handleBlur()}
          {...props}
        />
      );
    },
    Select: <T extends object>(props: SelectProps<T>) => {
      const field = useFieldContext<Key | null>();
      return (
        <Select
          selectedKey={field.state.value}
          onSelectionChange={(key) => field.handleChange(key)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    Combobox: <T extends object>(props: ComboboxProps<T>) => {
      const field = useFieldContext<Key | null>();
      return (
        <Combobox
          selectedKey={field.state.value}
          onSelectionChange={(key) => field.handleChange(key)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    SearchField: (props: SearchFieldProps) => {
      const field = useFieldContext<string>();
      return (
        <SearchField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    DateField: (props: DateFieldProps<DateValue>) => {
      const field = useFieldContext<DateValue | null>();
      return (
        <DateField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    DatePicker: (props: DatePickerProps<DateValue>) => {
      const field = useFieldContext<DateValue | null>();
      return (
        <DatePicker
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    DateRangePicker: (props: DateRangePickerProps<any>) => {
      const field = useFieldContext<RangeValue<DateValue> | null>();
      return (
        <DateRangePicker
          value={field.state.value as any}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    TimeField: (props: TimeFieldProps<TimeValue>) => {
      const field = useFieldContext<TimeValue | null>();
      return (
        <TimeField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    ColorField: (props: ColorFieldProps) => {
      const field = useFieldContext<Color | null>();
      return (
        <ColorField
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          errorMessage={field.state.meta.errors?.[0]}
          isInvalid={field.state.meta.errors?.[0] !== undefined}
          {...props}
        />
      );
    },
    ColorPicker: (props: ColorPickerProps) => {
      const field = useFieldContext<string | Color>();
      return (
        <ColorPicker
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          {...props}
        />
      );
    },
  },
});

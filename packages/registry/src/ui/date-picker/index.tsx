"use client";

import type { DateValue } from "react-aria";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { DatePickerProps, DatePickerRootProps } from "./basic";
import {
  DatePicker as _DatePicker,
  DatePickerRoot as _DatePickerRoot,
} from "./basic";

// export const Combobox = <T extends object = object>(
//   props: ComboboxProps<T>,
// ) => {
//   const Component = createDynamicComponent<ComboboxProps<T>>(
//     "combobox",
//     "Combobox",
//     _Combobox,
//     {},
//   );

//   return <Component {...props} />;
// };

export const DatePicker = <T extends DateValue>(props: DatePickerProps<T>) => {
  const Component = createDynamicComponent<DatePickerProps<T>>(
    "date-picker",
    "DatePicker",
    _DatePicker,
    {},
  );

  return <Component {...props} />;
};

export const DatePickerRoot = <T extends DateValue>(
  props: DatePickerRootProps<T>,
) => {
  const Component = createDynamicComponent<DatePickerRootProps<T>>(
    "date-picker",
    "DatePickerRoot",
    _DatePickerRoot,
    {},
  );

  return <Component {...props} />;
};

export type { DatePickerProps, DatePickerRootProps };

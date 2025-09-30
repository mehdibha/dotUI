"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  DateRangePicker as _DateRangePicker,
  DateRangePickerRoot as _DateRangePickerRoot,
} from "./basic";
import type { DateRangePickerProps, DateRangePickerRootProps } from "./basic";

export const DateRangePicker = createDynamicComponent<
  DateRangePickerProps<any>
>("date-range-picker", "DateRangePicker", _DateRangePicker, {});

export const DateRangePickerRoot = createDynamicComponent<
  DateRangePickerRootProps<any>
>("date-range-picker", "DateRangePickerRoot", _DateRangePickerRoot, {});

export type { DateRangePickerProps, DateRangePickerRootProps };

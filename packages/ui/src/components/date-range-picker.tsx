"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  DateRangePicker as _DateRangePicker,
  DateRangePickerRoot as _DateRangePickerRoot,
} from "../registry/components/date-range-picker/basic";
import type {
  DateRangePickerProps,
  DateRangePickerRootProps,
} from "../registry/components/date-range-picker/basic";

export const DateRangePicker = createDynamicComponent<
  DateRangePickerProps<any>
>("date-range-picker", "DateRangePicker", _DateRangePicker, {});

export const DateRangePickerRoot = createDynamicComponent<
  DateRangePickerRootProps<any>
>("date-range-picker", "DateRangePickerRoot", _DateRangePickerRoot, {});

export type { DateRangePickerProps, DateRangePickerRootProps };

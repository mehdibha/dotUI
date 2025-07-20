"use client";

import React from "react";

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
>(
  "date-range-picker",
  "DateRangePicker",
  _DateRangePicker,
  {
    basic: React.lazy(() =>
      import("../registry/components/date-range-picker/basic").then((mod) => ({
        default: mod.DateRangePicker,
      })),
    ),
  },
);

export const DateRangePickerRoot = createDynamicComponent<
  DateRangePickerRootProps<any>
>("date-range-picker", "DateRangePickerRoot", _DateRangePickerRoot, {
  basic: React.lazy(() =>
    import("../registry/components/date-range-picker/basic").then((mod) => ({
      default: mod.DateRangePickerRoot,
    })),
  ),
});

export type { DateRangePickerProps, DateRangePickerRootProps };

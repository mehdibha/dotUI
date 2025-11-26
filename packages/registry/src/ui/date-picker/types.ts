import type {
  DatePickerProps as AriaDatePickerProps,
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
} from "react-aria-components";

import type { DialogContentProps } from "@dotui/registry/ui/dialog";
import type { InputGroupProps } from "@dotui/registry/ui/input";
import type { OverlayProps } from "@dotui/registry/ui/overlay";

export type DatePickerProps<T extends DateValue> =
  | ({
      /**
       * The selection mode of the date picker.
       * @default 'single'
       */
      mode?: "single";
    } & AriaDatePickerProps<T>)
  | ({
      /**
       * The selection mode of the date picker.
       */
      mode: "range";
    } & AriaDateRangePickerProps<T>);

export interface DatePickerInputProps extends InputGroupProps {}

export interface DatePickerContentProps
  extends DialogContentProps,
    Pick<OverlayProps, "type" | "mobileType" | "popoverProps"> {}

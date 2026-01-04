import type {
	DatePickerProps as AriaDatePickerProps,
	DateRangePickerProps as AriaDateRangePickerProps,
	DateValue,
} from "react-aria-components";

import type { DialogContentProps } from "@dotui/registry/ui/dialog";
import type { InputGroupProps } from "@dotui/registry/ui/input";
import type { OverlayProps } from "@dotui/registry/ui/overlay";

/**
 * A date picker combines a DateField and a Calendar popover to allow users to enter or select a date and time value.
 * When mode is "range", it combines two DateFields and a RangeCalendar popover to allow users to enter or select a date and time range.
 */
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

/**
 * Missing description.
 */
export interface DatePickerInputProps extends InputGroupProps {}

/**
 * Missing description.
 */
export interface DatePickerContentProps
	extends DialogContentProps,
		Pick<OverlayProps, "type" | "mobileType" | "popoverProps"> {}

"use client";

import { useContext } from "react";
import { CalendarIcon } from "lucide-react";
import {
	DateRangePicker as AriaDataRangePicker,
	DatePicker as AriaDatePicker,
	RangeCalendarContext as AriaRangeCalendarContext,
	composeRenderProps,
} from "react-aria-components";
import type {
	DateRangePickerProps as AriaDataRangePickerProps,
	DatePickerProps as AriaDatePickerProps,
	DateValue,
} from "react-aria-components";

import { Button } from "@/registry/ui/button";
import { DialogContent, type DialogContentProps } from "@/registry/ui/dialog";
import { DateInput, InputAddon, InputGroup } from "@/registry/ui/input";
import { Overlay, type OverlayProps } from "@/registry/ui/overlay";
import type { InputGroupProps } from "@/registry/ui/input";

import { useStyles } from "./styles";

// MARK: datePickerStyles

// MARK: DatePicker

type DatePickerProps<T extends DateValue> =
	| ({
			mode?: "single";
	  } & AriaDatePickerProps<T>)
	| ({
			mode: "range";
	  } & AriaDataRangePickerProps<T>);

const DatePicker = <T extends DateValue>({ mode = "single", className, ...props }: DatePickerProps<T>) => {
	const datePickerStyles = useStyles();
	if (mode === "range") {
		return (
			<AriaDataRangePicker
				className={composeRenderProps(className as AriaDataRangePickerProps<T>["className"], (className) =>
					datePickerStyles({ className }),
				)}
				{...(props as AriaDataRangePickerProps<T>)}
			/>
		);
	}

	return (
		<AriaDatePicker
			className={composeRenderProps(className as AriaDatePickerProps<T>["className"], (className) =>
				datePickerStyles({ className }),
			)}
			{...(props as AriaDatePickerProps<T>)}
		/>
	);
};

// MARK: DatePickerInput

interface DatePickerInputProps extends InputGroupProps {}

const DatePickerInput = (props: DatePickerInputProps) => {
	const rangeCalendarContext = useContext(AriaRangeCalendarContext);
	const mode = rangeCalendarContext ? "range" : "single";

	return (
		<InputGroup {...props}>
			{mode === "single" ? (
				<DateInput />
			) : (
				<>
					<DateInput slot="start" />
					<span>–</span>
					<DateInput slot="end" />
				</>
			)}
			<InputAddon>
				<Button>
					<CalendarIcon />
				</Button>
			</InputAddon>
		</InputGroup>
	);
};

// MARK: DatePickerContent

interface DatePickerContentProps
	extends DialogContentProps,
		Pick<OverlayProps, "type" | "mobileType" | "popoverProps"> {}

const DatePickerContent = ({
	children,
	type = "popover",
	mobileType,
	popoverProps,
	...props
}: DatePickerContentProps) => {
	return (
		<Overlay type={type} mobileType={mobileType} popoverProps={popoverProps}>
			<DialogContent {...props}>{children}</DialogContent>
		</Overlay>
	);
};

// MARK: exports

export type { DatePickerProps, DatePickerContentProps, DatePickerInputProps };
export { DatePicker, DatePickerContent, DatePickerInput };

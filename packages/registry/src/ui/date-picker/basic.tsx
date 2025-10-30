"use client";

import { useContext } from "react";
import { CalendarIcon } from "lucide-react";
import {
  DateRangePicker as AriaDataRangePicker,
  DatePicker as AriaDatePicker,
  RangeCalendarContext as AriaRangeCalendarContext,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  DateRangePickerProps as AriaDataRangePickerProps,
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import {
  DialogContent,
  type DialogContentProps,
} from "@dotui/registry/ui/dialog";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";
import type { InputGroupProps } from "@dotui/registry/ui/input";

const datePickerStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

type DatePickerProps<T extends DateValue> =
  | ({
      mode?: "single";
    } & AriaDatePickerProps<T>)
  | ({
      mode: "range";
    } & AriaDataRangePickerProps<T>);

const DatePicker = <T extends DateValue>({
  mode = "single",
  className,
  ...props
}: DatePickerProps<T>) => {
  if (mode === "range") {
    return (
      <AriaDataRangePicker
        className={composeRenderProps(
          className as AriaDataRangePickerProps<T>["className"],
          (className) => datePickerStyles({ className }),
        )}
        {...(props as AriaDataRangePickerProps<T>)}
      />
    );
  }

  return (
    <AriaDatePicker
      className={composeRenderProps(
        className as AriaDatePickerProps<T>["className"],
        (className) => datePickerStyles({ className }),
      )}
      {...(props as AriaDatePickerProps<T>)}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

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

/* -----------------------------------------------------------------------------------------------*/

interface DatePickerContentProps extends DialogContentProps {}

const DatePickerContent = ({ children, ...props }: DatePickerContentProps) => {
  return (
    <Overlay type="popover">
      <DialogContent {...props}>{children}</DialogContent>
    </Overlay>
  );
};

export type { DatePickerProps, DatePickerContentProps, DatePickerInputProps };
export { DatePicker, DatePickerContent, DatePickerInput };

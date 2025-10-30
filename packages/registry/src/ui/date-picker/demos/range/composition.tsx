"use client";

import { CalendarIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { RangeCalendar } from "@dotui/registry/ui/calendar";
import { DateInput, DateSegment } from "@dotui/registry/ui/date-input";
import { DatePickerRoot } from "@dotui/registry/ui/date-picker";
import { DialogContent } from "@dotui/registry/ui/dialog";
import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { InputRoot } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";

export default function Demo() {
  return (
    <DatePickerRoot>
      <Label>Meeting date</Label>
      <InputRoot
        suffix={
          <Button variant="default" size="sm" shape="square" className="size-7">
            <CalendarIcon />
          </Button>
        }
        className="pr-1"
      >
        <DateInput slot="start">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <span aria-hidden="true">–</span>
        <DateInput slot="end" className="flex-1">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
      </InputRoot>
      <Description>Please select a date.</Description>
      <FieldError />
      <Overlay type="popover" mobileType="drawer">
        <DialogContent>
          <RangeCalendar />
        </DialogContent>
      </Overlay>
    </DatePickerRoot>
  );
}

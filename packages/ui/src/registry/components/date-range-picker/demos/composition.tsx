"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import { RangeCalendar } from "@dotui/ui/components/calendar";
import { DateInput, DateSegment } from "@dotui/ui/components/date-input";
import { DatePickerRoot } from "@dotui/ui/components/date-picker";
import { DialogContent } from "@dotui/ui/components/dialog";
import { Description, FieldError, Label } from "@dotui/ui/components/field";
import { InputRoot } from "@dotui/ui/components/input";
import { Overlay } from "@dotui/ui/components/overlay";
import { CalendarIcon } from "@dotui/ui/icons";

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

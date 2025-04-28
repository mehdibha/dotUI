"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { RangeCalendar } from "@/components/dynamic-ui/calendar";
import { DateInput, DateSegment } from "@/components/dynamic-ui/date-input";
import { DatePickerRoot } from "@/components/dynamic-ui/date-picker";
import { DialogContent } from "@/components/dynamic-ui/dialog";
import { Description, FieldError, Label } from "@/components/dynamic-ui/field";
import { InputRoot } from "@/components/dynamic-ui/input";
import { Overlay } from "@/components/dynamic-ui/overlay";

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

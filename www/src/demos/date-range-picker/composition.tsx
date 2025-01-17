"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { DateInput, DateSegment } from "@/components/dynamic-core/date-input";
import { DatePickerRoot } from "@/components/dynamic-core/date-picker";
import { DialogContent } from "@/components/dynamic-core/dialog";
import {
  Description,
  FieldError,
  Label,
} from "@/components/dynamic-core/field";
import { InputRoot } from "@/components/dynamic-core/input";
import { Overlay } from "@/components/dynamic-core/overlay";
import { RangeCalendar } from "@/components/dynamic-core/calendar";

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

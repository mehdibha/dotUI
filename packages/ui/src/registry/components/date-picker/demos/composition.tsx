"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Calendar } from "@dotui/ui/components/calendar";
import { DateInput, DateSegment } from "@dotui/ui/components/date-input";
import { DatePickerRoot } from "@dotui/ui/components/date-picker";
import { DialogContent } from "@dotui/ui/components/dialog";
import { Description, FieldError, Label } from "@dotui/ui/components/field";
import { InputRoot } from "@dotui/ui/components/input";
import { Overlay } from "@dotui/ui/components/overlay";

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
        <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
      </InputRoot>
      <Description>Please select a date.</Description>
      <FieldError />
      <Overlay type="popover" mobileType="drawer">
        <DialogContent>
          <Calendar />
        </DialogContent>
      </Overlay>
    </DatePickerRoot>
  );
}

"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { Calendar } from "@/registry/ui/default/core/calendar";
import { DateInput, DateSegment } from "@/registry/ui/default/core/date-input";
import { DatePickerRoot } from "@/registry/ui/default/core/date-picker";
import { DialogContent } from "@/registry/ui/default/core/dialog";
import {
  Description,
  FieldError,
  Label,
} from "@/registry/ui/default/core/field";
import { InputRoot } from "@/registry/ui/default/core/input";
import { Overlay } from "@/registry/ui/default/core/overlay";
import { CalendarIcon } from "@/__icons__";

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

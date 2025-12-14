"use client";

import { CalendarIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker } from "@dotui/registry/ui/date-picker";
import { DialogContent } from "@dotui/registry/ui/dialog";
import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";

export default function Demo() {
  return (
    <DatePicker mode="range">
      <Label>Meeting date</Label>
      <InputGroup>
        <DateInput slot="start" />
        <span>–</span>
        <DateInput slot="end" />
        <InputAddon>
          <Button variant="default" size="sm">
            <CalendarIcon />
          </Button>
        </InputAddon>
      </InputGroup>
      <Description>Please select a date.</Description>
      <FieldError />
      <Overlay type="popover" mobileType="drawer">
        <DialogContent>
          <Calendar />
        </DialogContent>
      </Overlay>
    </DatePicker>
  );
}

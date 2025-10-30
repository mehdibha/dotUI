"use client";

import { CalendarIcon } from "lucide-react";

import { DateField } from "@dotui/registry/ui/date-field";
import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";

export function DateFieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DateField>
        <DateInput />
      </DateField>

      <DateField>
        <InputGroup>
          <InputAddon>
            <CalendarIcon />
          </InputAddon>
          <DateInput />
        </InputGroup>
      </DateField>

      <DateField>
        <Label>Event date</Label>
        <DateInput />
        <Description>Please select your event date.</Description>
        <FieldError />
      </DateField>
    </div>
  );
}

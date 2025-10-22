"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";

import { cn } from "@dotui/registry-v2/lib/utils";
import { Button } from "@dotui/registry-v2/ui/button";
import { Calendar } from "@dotui/registry-v2/ui/calendar";
import { DatePicker } from "@dotui/registry-v2/ui/date-picker";
import { DialogContent } from "@dotui/registry-v2/ui/dialog";
import { Label } from "@dotui/registry-v2/ui/field";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry-v2/ui/input";
import { Overlay } from "@dotui/registry-v2/ui/overlay";

export function DatePickerDemo() {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef2 = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col gap-6">
      <DatePicker>
        <Label>Meeting date</Label>
        <InputGroup>
          <DateInput />
          <InputAddon>
            <Button>
              <CalendarIcon />
            </Button>
          </InputAddon>
        </InputGroup>
        <Overlay type="popover">
          <DialogContent>
            <Calendar />
          </DialogContent>
        </Overlay>
      </DatePicker>

      <DatePicker>
        {({ state }) => (
          <>
            <Label>Meeting date</Label>
            <Button
              ref={triggerRef}
              className={cn(
                "w-48 justify-start border-border-field font-normal",
                !state.value && "text-fg-muted",
              )}
            >
              <CalendarIcon className="text-fg-muted" />{" "}
              {state.value ? state.value.toString() : "Pick a date"}
            </Button>
            <Overlay type="popover" popoverProps={{ triggerRef }}>
              <DialogContent>
                <Calendar aria-label="Pick a date" />
              </DialogContent>
            </Overlay>
          </>
        )}
      </DatePicker>

      <DatePicker>
        {({ state }) => (
          <>
            <Label>Meeting date</Label>
            <Button
              ref={triggerRef2}
              className={cn(
                "w-48 justify-between border-border-field font-normal",
                !state.value && "text-fg-muted",
              )}
            >
              {state.value ? state.value.toString() : "Pick a date"}
              <CalendarIcon className="text-fg-muted" />{" "}
            </Button>
            <Overlay type="popover" popoverProps={{ triggerRef: triggerRef2 }}>
              <DialogContent>
                <Calendar aria-label="Pick a date" />
              </DialogContent>
            </Overlay>
          </>
        )}
      </DatePicker>
    </div>
  );
}

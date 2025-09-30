"use client";

import { Heading } from "react-aria-components";

import { ChevronLeftIcon, ChevronRightIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  RangeCalendarRoot,
} from "@dotui/registry/ui/calendar";

export default function Demo() {
  return (
    <RangeCalendarRoot aria-label="Trip dates">
      <CalendarHeader>
        <Button slot="previous" variant="default" shape="circle" size="sm">
          <ChevronLeftIcon />
        </Button>
        <Heading className="text-sm" />
        <Button slot="next" variant="default" shape="circle" size="sm">
          <ChevronRightIcon />
        </Button>
      </CalendarHeader>
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </RangeCalendarRoot>
  );
}

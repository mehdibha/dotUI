"use client";

import { Heading } from "react-aria-components";

import { Button } from "@dotui/ui/components/button";
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarRoot,
} from "@dotui/ui/components/calendar";
import { ChevronLeftIcon, ChevronRightIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <CalendarRoot aria-label="Event date">
      <CalendarHeader>
        <Button slot="previous" variant="outline" shape="circle" size="sm">
          <ChevronLeftIcon />
        </Button>
        <Heading className="text-fg-muted text-sm" />
        <Button slot="next" variant="outline" shape="circle" size="sm">
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
    </CalendarRoot>
  );
}
